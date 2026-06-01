document.addEventListener('DOMContentLoaded', () => {

  const TYPE_LABELS = {
    multiple_choice: 'Selección única',
    multiple_response: 'Selección múltiple',
    true_false: 'Verdadero / Falso',
    short_answer: 'Respuesta corta',
    fill_blank: 'Completar espacios',
    numeric: 'Numérica',
    essay: 'Ensayo',
    matching: 'Relación de columnas'
  };
  const DIFF_LABELS = { easy: 'Fácil', medium: 'Media', hard: 'Difícil' };
  const DIFF_VARIANTS = { easy: 'success', Fácil: 'success', medium: 'warning', Media: 'warning', hard: 'danger', Difícil: 'danger' };
  function typeLabel(t) { return TYPE_LABELS[t] || t; }
  function diffLabel(d) { return DIFF_LABELS[d] || d || ''; }
  function diffVariant(d) { return DIFF_VARIANTS[d] || DIFF_VARIANTS[DIFF_LABELS[d]] || 'secondary'; }

  const questionsContainer =
    document.getElementById(
      'section-preguntas'
    );

  const questionBankList =
    document.getElementById(
      'questionBankList'
    );

const editData =
  window.quizEditData || {};

const isEdit =
  editData.isEdit || false;

const editMode =
  editData.mode || 'test';

let selectedQuestions =
  Array.isArray(editData.questions)
    ? editData.questions
    : [];
/*
  =========================================
  RENDER QUESTIONS
  =========================================
  */

  function renderQuestions() {

    if (selectedQuestions.length === 0) {

      questionsContainer.innerHTML = `
        <p class="text-muted">
          No hay preguntas añadidas aún.
        </p>
      `;

      return;
    }

    questionsContainer.innerHTML = `
      <ul class="list-group">
        ${selectedQuestions.map((q, index) => `
          <li class="list-group-item">

            <div class="d-flex justify-content-between">

              <div>

                <strong>
                  ${q.question}
                </strong>

                <div class="small text-muted">

                  ${typeLabel(q.type)}

                  ·

                  ${q.category || 'Sin categoría'}

                </div>

              </div>

              <div class="d-flex gap-2">

                <input
                  type="number"
                  min="1"
                  value="${q.pts || 1}"
                  class="form-control form-control-sm question-points"
                  data-index="${index}"
                  style="width:80px"
                >

                <button
                  class="btn btn-sm btn-outline-danger remove-question"
                  data-index="${index}"
                >
                  <i class="bi bi-trash"></i>
                </button>

              </div>

            </div>

          </li>
        `).join('')}
      </ul>
    `;

    /*
    =====================================
    REMOVE
    =====================================
    */

    document
      .querySelectorAll('.remove-question')
      .forEach(btn => {

        btn.addEventListener('click', () => {

          const index =
            Number(btn.dataset.index);

          selectedQuestions.splice(
            index,
            1
          );

          renderQuestions();
        });

      });

    /*
    =====================================
    POINTS
    =====================================
    */

    document
      .querySelectorAll('.question-points')
      .forEach(input => {

        input.addEventListener('change', () => {

          const index =
            Number(input.dataset.index);

          selectedQuestions[index].pts =
            Number(input.value);
        });

      });
  }

  /*
  =========================================
  IMPORT QUESTIONS
  =========================================
  */

  async function loadQuestionBank() {

    const res =
      await fetch('/api/questions');

    const data =
      await res.json();

    // Filter out already-selected questions
    const selectedIds = new Set(selectedQuestions.map(q => String(q.question_id)));

    const searchInput = document.getElementById('questionSearch');
    let allQuestions = data.questions || [];

    function renderBankList(questions) {
      if (questions.length === 0) {
        questionBankList.innerHTML = '<p class="text-muted">No hay preguntas en el banco.</p>';
        return;
      }
      questionBankList.innerHTML = questions.map(q => {
        const alreadyAdded = selectedIds.has(String(q.id));
        const meta = q.metadata || {};
        const opts = meta.options || [];
        const pairs = meta.pairs || [];
        let detailHtml = '';
        if (q.type === 'multiple_choice' || q.type === 'multiple_response') {
          detailHtml = opts.map((o, i) => {
            const isCorrect = q.type === 'multiple_choice'
              ? q.correct_answer === i || q.correct_answer === String(i)
              : Array.isArray(q.correct_answer) && (q.correct_answer.includes(i) || q.correct_answer.includes(String(i)));
            return `<li class="small ${isCorrect ? 'fw-semibold text-success' : 'text-muted'}">${isCorrect ? '✓ ' : ''}${o}</li>`;
          }).join('');
          detailHtml = `<ul class="list-unstyled mb-0 mt-1 ps-2">${detailHtml}</ul>`;
        } else if (q.type === 'true_false') {
          const correct = q.correct_answer === true || q.correct_answer === 'true' ? 'Verdadero' : 'Falso';
          detailHtml = `<p class="small text-success mb-0 mt-1">✓ ${correct}</p>`;
        } else if (q.type === 'short_answer' || q.type === 'fill_blank' || q.type === 'numeric') {
          if (q.correct_answer != null && q.correct_answer !== '') {
            detailHtml = `<p class="small text-success mb-0 mt-1">✓ ${q.correct_answer}</p>`;
          }
        } else if (q.type === 'matching') {
          detailHtml = pairs.map(p => `<li class="small text-muted">${p.left} → ${p.right}</li>`).join('');
          detailHtml = detailHtml ? `<ul class="list-unstyled mb-0 mt-1 ps-2">${detailHtml}</ul>` : '';
        }
        const ariaDesc = [typeLabel(q.type), q.difficulty ? diffLabel(q.difficulty) : '', q.category || ''].filter(Boolean).join(', ');
        return `
          <div class="card mb-2 border-0 shadow-sm">
            <div class="card-body py-2">
              <div class="d-flex justify-content-between align-items-start gap-3">
                <div class="flex-grow-1">
                  <p class="fw-medium mb-1">${q.question}</p>
                  <div class="d-flex gap-2 flex-wrap mb-1">
                    <span class="badge bg-light text-dark border">${typeLabel(q.type)}</span>
                    ${q.difficulty ? `<span class="badge text-bg-${diffVariant(q.difficulty)}">${diffLabel(q.difficulty)}</span>` : ''}
                    ${q.category ? `<span class="badge bg-light text-muted border">${q.category}</span>` : ''}
                  </div>
                  ${detailHtml}
                </div>
                <button class="btn btn-sm ${alreadyAdded ? 'btn-secondary' : 'btn-primary'} import-question flex-shrink-0"
                  data-id="${q.id}"
                  aria-label="${alreadyAdded ? 'Ya añadida: ' + q.question : 'Importar: ' + q.question + ' (' + ariaDesc + ')'}"
                  ${alreadyAdded ? 'disabled' : ''}>
                  ${alreadyAdded ? 'Añadida' : 'Importar'}
                </button>
              </div>
            </div>
          </div>
        `;
      }).join('');

      document.querySelectorAll('.import-question:not([disabled])').forEach(btn => {
        btn.addEventListener('click', async () => {
          const id = btn.dataset.id;
          const res = await fetch(`/api/questions/${id}`);
          const data = await res.json();
          selectedQuestions.push({
            question_id: data.question.id,
            question: data.question.question,
            type: data.question.type,
            metadata: data.question.metadata,
            correct_answer: data.question.correct_answer,
            category: data.question.category,
            pts: 1
          });
          selectedIds.add(String(data.question.id));
          btn.textContent = 'Añadida';
          btn.disabled = true;
          btn.className = 'btn btn-sm btn-secondary flex-shrink-0';
          renderQuestions();
        });
      });
    }

    renderBankList(allQuestions);

    if (searchInput) {
      searchInput.addEventListener('input', () => {
        const term = searchInput.value.toLowerCase().trim();
        renderBankList(term ? allQuestions.filter(q => q.question.toLowerCase().includes(term)) : allQuestions);
      });
    }

  }

  loadQuestionBank();

  /*
  =========================================
  RECEIVE NEW QUESTION
  =========================================
  */

  document.addEventListener(
    'question:saved',
    (e) => {

      selectedQuestions.push(
        e.detail
      );

      renderQuestions();
    }
  );

  /*
  =========================================
  SAVE QUIZ
  =========================================
  */

  document
    .getElementById('quizForm')
    .addEventListener('submit', async (e) => {

      e.preventDefault();

      const title = document.getElementById('quizName').value.trim();
      if (!title) {
        alert('El título del cuestionario es obligatorio.');
        document.getElementById('quizName').focus();
        return;
      }

      if (selectedQuestions.length === 0) {
        alert('Debes agregar al menos una pregunta antes de guardar.');
        return;
      }

const saveMode =
  document.getElementById('saveMode').value;

      if (saveMode === 'test') {
        const dueAt = document.getElementById('quizDueDate').value;
        if (!dueAt) {
          alert('La fecha límite es obligatoria para cuestionarios reales.');
          document.getElementById('quizDueDate').focus();
          return;
        }
      }

let url = '/api/tests';
let method = 'POST';

/*
=====================================
TEMPLATE
=====================================
*/

if (saveMode === 'template') {

  url = '/api/templates';
}

/*
=====================================
EDIT TEST
=====================================
*/

if (
  isEdit &&
  editMode === 'test'
) {

  url =
    `/api/tests/${editData.code}`;

  method = 'PATCH';
}

/*
=====================================
EDIT TEMPLATE
=====================================
*/

if (
  isEdit &&
  editMode === 'template'
) {

  url =
    `/api/templates/${editData.templateId}`;

  method = 'PATCH';
}

      const payload = {

        title:
          document.getElementById(
            'quizName'
          ).value,

        description:
          document.getElementById(
            'quizDescription'
          ).value,

        category:
          document.getElementById(
            'quizCategory'
          ).value,

        group_code:
          document.getElementById(
            'quizGroup'
          ).value,

        status:
          document.getElementById(
            'quizStatus'
          ).value,

time_limit_minutes:
  document.getElementById(
    'quizTime'
  ).value
    ? Number(document.getElementById('quizTime').value)
    : null,

min_score:
  document.getElementById(
    'quizScore'
  ).value
    ? Number(document.getElementById('quizScore').value)
    : null,

        show_answers:
          document.getElementById(
            'showAnswers'
          ).checked,

        allow_retries:
          document.getElementById(
            'allowRetries'
          ).checked,

shuffle_questions:
  document.getElementById(
    'shuffleQuestions'
  ).checked,

shuffle_answers:
  document.getElementById(
    'shuffleAnswers'
  ).checked,

        due_at: document.getElementById('quizDueDate').value || null,

        questions:
          selectedQuestions
      };

      const res =
        await fetch(
          url,
          {
            method,

            headers: {
              'Content-Type':
                'application/json'
            },

            body:
              JSON.stringify(payload)
          }
        );

      const data =
        await res.json();

      if (!res.ok) {

        alert(
          data.error || 'Error al guardar el cuestionario'
        );

        return;
      }

/*
=====================================
REDIRECTS
=====================================
*/

if (saveMode === 'template') {

  window.location =
    '/teacher/templates';

  return;
}

window.location =
  '/teacher/quizzes';

    });

  renderQuestions();

  // Hide/show status and due date based on save mode
  const saveModeSelect = document.getElementById('saveMode');
  const statusWrapper = document.getElementById('statusWrapper');
  const dueDateWrapper = document.getElementById('dueDateWrapper');

  function toggleTestOnlyFields() {
    const isTemplate = saveModeSelect && saveModeSelect.value === 'template';
    if (statusWrapper) statusWrapper.style.display = isTemplate ? 'none' : '';
    if (dueDateWrapper) dueDateWrapper.style.display = isTemplate ? 'none' : '';
  }

  if (saveModeSelect) {
    saveModeSelect.addEventListener('change', toggleTestOnlyFields);
    toggleTestOnlyFields();
  }

});
