document.addEventListener('DOMContentLoaded', async () => {
  const pathParts = window.location.pathname.split('/').filter(Boolean);
  const code = pathParts[pathParts.length - 1];
  if (!code) return;

  const container = document.getElementById('quiz-form-container');
  if (!container) return;

  let attemptId = null;
  let questions = [];
  let autoSaveTimer = null;
  let timerInterval = null;

  container.innerHTML = '<p class="text-muted">Cargando cuestionario...</p>';

  try {
    const [testResp, startResp] = await Promise.all([
      fetch(`/api/tests/${code}/detail`, { credentials: 'include' }),
      fetch(`/api/tests/${code}/start`, { method: 'POST', credentials: 'include' })
    ]);

    if (!testResp.ok) throw new Error('No se pudo cargar el cuestionario.');
    if (!startResp.ok) {
      const errData = await startResp.json().catch(() => ({}));
      throw new Error(errData.error || 'No se pudo iniciar el intento.');
    }

    const testData = await testResp.json();
    const startData = await startResp.json();

    questions = testData.test.questions || [];
    attemptId = startData.attempt.id;

    if (startData.attempt.resumed) {
      const savedAnswers = await fetch(`/api/attempt-answers/${attemptId}`, { credentials: 'include' });
      if (savedAnswers.ok) {
        const savedData = await savedAnswers.json();
        renderQuiz(savedData.answers || []);
      } else {
        renderQuiz([]);
      }
    } else {
      renderQuiz([]);
    }
  } catch (err) {
    container.innerHTML = `<div class="alert alert-danger" role="alert">${esc(err.message)}</div>`;
    return;
  }

  function startTimer(totalSeconds, onExpire) {
    const timerText = document.getElementById('timer-text');
    const timerDisplay = document.getElementById('timer-display');
    if (!timerText) return;

    let remaining = totalSeconds;

    function tick() {
      const m = Math.floor(remaining / 60);
      const s = remaining % 60;
      timerText.textContent = `${m}:${s.toString().padStart(2, '0')}`;

      if (remaining <= 60) {
        timerDisplay.className = 'badge bg-danger fs-6';
      } else if (remaining <= 180) {
        timerDisplay.className = 'badge bg-warning text-dark fs-6';
      }

      if (remaining <= 0) {
        clearInterval(timerInterval);
        onExpire();
      }
      remaining--;
    }

    tick();
    timerInterval = setInterval(tick, 1000);
  }

  function updateProgress() {
    const answers = collectAnswers();
    const answered = answers.filter(a => {
      const r = a.response;
      if (r === null || r === undefined || r === '') return false;
      if (Array.isArray(r)) return r.length > 0;
      return true;
    }).length;
    const total = questions.length;
    const pct = total > 0 ? Math.round((answered / total) * 100) : 0;
    const bar = document.getElementById('progress-bar');
    const wrapper = document.getElementById('progress-bar-wrapper');
    const label = document.getElementById('progress-label');
    if (bar) bar.style.width = pct + '%';
    if (wrapper) wrapper.setAttribute('aria-valuenow', pct);
    if (label) label.textContent = `${answered} de ${total} respondidas`;
  }

  function renderQuiz(savedAnswers) {
    if (questions.length === 0) {
      container.innerHTML = '<p class="text-muted">Este cuestionario no tiene preguntas.</p>';
      return;
    }

    const savedMap = {};
    savedAnswers.forEach(a => { savedMap[a.test_question_id] = a.response; });

    container.innerHTML = '';
    const form = document.createElement('form');
    form.id = 'quizForm';
    form.setAttribute('novalidate', '');

    questions.forEach((q, index) => {
      const fieldset = document.createElement('fieldset');
      fieldset.className = 'card mb-4 border-0 shadow-sm';
      fieldset.setAttribute('data-question-id', q.id);

      const saved = savedMap[q.id];
      fieldset.innerHTML = `
        <div class="card-body">
          <legend class="h5 mb-3">
            Pregunta ${index + 1}
            <small class="text-muted fw-normal small ms-2">${q.pts} pt${q.pts !== 1 ? 's' : ''}</small>
          </legend>
          <p class="mb-3">${esc(q.question)}</p>
          <div class="answer-area">${buildInput(q, saved)}</div>
        </div>
      `;
      form.appendChild(fieldset);
    });

    const footer = document.createElement('div');
    footer.className = 'mt-4 d-flex justify-content-between align-items-center';
    footer.innerHTML = `
      <span id="autosave-status" class="text-muted small" aria-live="polite"></span>
      <button type="submit" class="btn btn-success btn-lg">
        <i class="bi bi-check-circle me-1" aria-hidden="true"></i> Enviar respuestas
      </button>
    `;
    form.appendChild(footer);
    container.appendChild(form);

    autoSaveTimer = setInterval(() => saveAnswers(false), 30000);

    // Show progress bar and timer
    const metaBar = document.getElementById('quiz-meta-bar');
    if (metaBar) metaBar.style.display = '';

    // Track progress on any input change
    form.addEventListener('change', updateProgress);
    form.addEventListener('input', updateProgress);
    updateProgress();

    // Start timer if time limit is set
    const timeLimitMinutes = window.quizTimeLimitMinutes || 0;
    if (timeLimitMinutes > 0) {
      startTimer(timeLimitMinutes * 60, () => {
        clearInterval(autoSaveTimer);
        alert('¡El tiempo ha expirado! El cuestionario se enviará automáticamente.');
        saveAnswers(true).catch(() => {});
      });
    }

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!confirm('¿Estás seguro de que deseas enviar el cuestionario? No podrás modificar tus respuestas después.')) return;
      clearInterval(autoSaveTimer);
      clearInterval(timerInterval);
      try {
        await saveAnswers(true);
      } catch (err) {
        alert('Error al enviar: ' + err.message);
      }
    });
  }

  function buildInput(q, saved) {
    const type = q.type;
    const opts = (q.metadata && q.metadata.options) || [];
    const pairs = (q.metadata && q.metadata.pairs) || [];

    if (type === 'multiple_choice') {
      return `<div class="list-group" role="radiogroup" aria-labelledby="q-label-${q.id}">
        ${opts.map((opt, i) => `
          <label class="list-group-item list-group-item-action">
            <input type="radio" name="q-${q.id}" value="${i}" class="form-check-input me-2"
              ${saved === i || saved === String(i) ? 'checked' : ''}>
            ${esc(opt)}
          </label>
        `).join('')}
      </div>`;
    }

    if (type === 'multiple_response') {
      const savedArr = Array.isArray(saved) ? saved.map(String) : [];
      return `<div class="list-group" role="group" aria-labelledby="q-label-${q.id}">
        ${opts.map((opt, i) => `
          <label class="list-group-item list-group-item-action">
            <input type="checkbox" name="q-${q.id}" value="${i}" class="form-check-input me-2"
              ${savedArr.includes(String(i)) ? 'checked' : ''}>
            ${esc(opt)}
          </label>
        `).join('')}
      </div>`;
    }

    if (type === 'true_false') {
      return `<div class="list-group" role="radiogroup">
        <label class="list-group-item list-group-item-action">
          <input type="radio" name="q-${q.id}" value="true" class="form-check-input me-2"
            ${saved === true || saved === 'true' ? 'checked' : ''}> Verdadero
        </label>
        <label class="list-group-item list-group-item-action">
          <input type="radio" name="q-${q.id}" value="false" class="form-check-input me-2"
            ${saved === false || saved === 'false' ? 'checked' : ''}> Falso
        </label>
      </div>`;
    }

    if (type === 'short_answer' || type === 'fill_blank') {
      return `<input type="text" name="q-${q.id}" class="form-control"
        placeholder="Tu respuesta" value="${esc(saved || '')}" aria-label="Respuesta">`;
    }

    if (type === 'numeric') {
      return `<input type="number" name="q-${q.id}" class="form-control"
        placeholder="Tu respuesta numérica" value="${esc(saved || '')}" aria-label="Respuesta numérica">`;
    }

    if (type === 'essay') {
      return `<textarea name="q-${q.id}" class="form-control" rows="5"
        placeholder="Escribe tu respuesta aquí..." aria-label="Respuesta de ensayo">${esc(saved || '')}</textarea>`;
    }

    if (type === 'matching') {
      const shuffled = [...pairs].sort(() => Math.random() - 0.5);
      const savedMap = Array.isArray(saved)
        ? Object.fromEntries(saved.map(s => [s.left, s.right]))
        : {};
      return `<div class="matching-pairs">
        ${pairs.map((pair, i) => `
          <div class="row g-2 mb-2 align-items-center">
            <div class="col-5">
              <div class="p-2 border rounded bg-light">${esc(pair.left)}</div>
            </div>
            <div class="col-1 text-center text-muted">→</div>
            <div class="col-6">
              <select name="q-${q.id}-${i}" class="form-select" aria-label="Par para ${esc(pair.left)}">
                <option value="">-- Selecciona --</option>
                ${shuffled.map(p => `
                  <option value="${esc(p.right)}" ${savedMap[pair.left] === p.right ? 'selected' : ''}>
                    ${esc(p.right)}
                  </option>
                `).join('')}
              </select>
            </div>
          </div>
        `).join('')}
      </div>`;
    }

    return `<input type="text" name="q-${q.id}" class="form-control"
      placeholder="Tu respuesta" value="${esc(saved || '')}" aria-label="Respuesta">`;
  }

  function collectAnswers() {
    return questions.map(q => {
      const type = q.type;
      let response = null;

      if (type === 'multiple_choice' || type === 'true_false') {
        const el = document.querySelector(`input[name="q-${q.id}"]:checked`);
        if (el) response = type === 'true_false' ? (el.value === 'true') : Number(el.value);
      } else if (type === 'multiple_response') {
        const els = document.querySelectorAll(`input[name="q-${q.id}"]:checked`);
        response = Array.from(els).map(e => Number(e.value));
      } else if (type === 'matching') {
        const pairs = (q.metadata && q.metadata.pairs) || [];
        response = pairs.map((pair, i) => {
          const sel = document.querySelector(`select[name="q-${q.id}-${i}"]`);
          return { left: pair.left, right: sel ? sel.value : '' };
        });
      } else {
        const el = document.querySelector(`[name="q-${q.id}"]`);
        if (el) response = el.value;
      }

      return { test_question_id: q.id, response };
    });
  }

  async function saveAnswers(submit) {
    const answers = collectAnswers();
    const statusEl = document.getElementById('autosave-status');

    const saveRes = await fetch('/api/attempt-answers', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ attempt_id: attemptId, answers })
    });

    if (!saveRes.ok) throw new Error('Error guardando respuestas');

    if (!submit) {
      if (statusEl) {
        statusEl.textContent = 'Guardado automáticamente ✓';
        setTimeout(() => { if (statusEl) statusEl.textContent = ''; }, 3000);
      }
      return;
    }

    const submitRes = await fetch(`/api/attempts/${attemptId}/submit`, {
      method: 'POST',
      credentials: 'include'
    });

    if (!submitRes.ok) throw new Error('Error al enviar el intento');

    window.location.href = window.isGuest
      ? '/quizzes/done'
      : `/student/result/${attemptId}`;
  }

  function esc(s) {
    if (s == null) return '';
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
});
