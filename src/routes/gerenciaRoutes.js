import express from 'express';
import {
  getGerencias,
  getTodosFuncionarios,
  getFuncionariosComFerias,
  getFuncionariosEmFerias
} from '../controllers/gerenciaController.js';


const router = express.Router();

router.get('/', getGerencias); // GET /gerencias
router.get('/funcionarios', getTodosFuncionarios); // GET /gerencias/funcionarios
router.get('/emferias', getFuncionariosEmFerias) // GET/gerencias/:sigla/gozo
router.get('/:sigla/funcionarios', getFuncionariosComFerias); // GET /gerencias/:sigla/funcionarios


export default router;
