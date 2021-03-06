import * as Yup from 'yup';

import Criteria from '../models/Criteria';

class CriteriaController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      criterion_id: Yup.number(),
    });

    try {
      await schema.validate(req.body, { abortEarly: false });
    } catch (error) {
      return res.status(400).json(error);
    }

    const criterion = req.body;
    criterion.project_id = req.params.id;

    // create criterion
    try {
      const {
        id, name, criterion_id, project_id,
      } = await Criteria.create(criterion);

      return res.status(200).json({
        id,
        name,
        criterion_id,
        project_id,
      });
    } catch (error) {
      return res.status(400).json({ error: { mensagem: 'Erro! Falha ao salvar critério.' } });
    }
  }

  async getCriteriaByProjectId(req, res) {
    const project_id = req.params.id;

    // verify if id is valid
    if (Number.isNaN(project_id)) {
      return res.status(400).json({ error: { mensagem: 'Project id Inválido!' } });
    }

    try {
      const listCriteria = await Criteria.findAll({
        where: { project_id, criterion_id: null },
        include: {
          model: Criteria,
          as: 'children',
          attributes: ['id', 'name', 'criterion_id'],
          include: {
            model: Criteria,
            as: 'children',
            attributes: ['id', 'name', 'criterion_id'],
          },
        },
      });

      return res.status(200).json(listCriteria);
    } catch (error) {
      return res.status(400).json({ error: { mensagem: error } });
    }
  }
}

export default new CriteriaController();
