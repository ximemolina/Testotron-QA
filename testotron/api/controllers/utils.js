const { response } = require("express");
const { z } = require("zod");

/**
 * @param {Error} err 
 * @param {response} res 
 */
function handleError(err, res) {
    if (err instanceof z.ZodError)
        res.status(400).json({ error: "Error de validación", issues: err.issues });
    else
        res.status(500).json({ error: err.message });
}

module.exports = { handleError };
