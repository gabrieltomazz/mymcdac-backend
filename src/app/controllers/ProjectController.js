import * as Yup from 'yup';

import Project from '../models/Project';
import Scale from '../models/Scale';

class ProjectController {
  async store(req, res) {
    // Fields Validation
    const schema = Yup.object().shape({
      project_goal: Yup.string().required(),
      project_locus: Yup.string().required(),
      performance: Yup.string().required(),
      steps: Yup.number().required(),
      start_date: Yup.date().required(),
      end_date: Yup.date().required(),
      scale_id: Yup.number().required(),
    });

    try {
      await schema.validate(req.body, { abortEarly: false });
    } catch (error) {
      return res.status(400).json(error);
    }

    const project = req.body;
    project.user_id = req.userId;

    // create project
    try {
      const { id, project_goal, project_locus } = await Project.create(project);

      return res.status(200).json({
        id,
        project_goal,
        project_locus,
      });
    } catch (error) {
      return res.status(400).json({ error: { mensagem: 'Erro! Falha ao salvar projeto.' } });
    }
  }

  async update(req, res) {
    // Fields Validation
    const schema = Yup.object().shape({
      id: Yup.number().required(),
      project_goal: Yup.string(),
      project_locus: Yup.string(),
      performance: Yup.string(),
      steps: Yup.number(),
      start_date: Yup.date(),
      end_date: Yup.date(),
      scale_id: Yup.number(),
    });

    try {
      await schema.validate(req.body, { abortEarly: false });
    } catch (error) {
      return res.status(400).json(error);
    }

    // update project
    try {
      const project = req.body;

      // find project
      const projects = await Project.findByPk(project.id);

      // verify if projects is empty
      if (!projects) {
        return res.status(401).json({ error: { mensagem: 'Invalid Scale!' } });
      }

      // update project
      const { id, project_goal, project_locus } = await projects.update(project);

      return res.status(200).json({
        id,
        project_goal,
        project_locus,
      });
    } catch (error) {
      return res.status(400).json({ error: { mensagem: 'Erro! Falha ao atualizar projeto.' } });
    }
  }

  async getProjectByUserId(req, res) {
    try {
      // user_id extracted from token
      const projects = await Project.findAll({
        where: { user_id: req.userId },
        include: {
          model: Scale,
          as: 'scale',
          attributes: ['id', 'description'],
        },
        order: ['id'],
      });

      return res.status(200).json(projects);
    } catch (error) {
      return res.status(200).json({ error: { mensagem: 'Falha ao consultar projeto!' } });
    }
  }

  async getProjectById(req, res) {
    const project_id = req.params.id;

    // verify if id is valid
    if (Number.isNaN(project_id)) {
      return res.status(400).json({ error: { mensagem: 'Project id Inválido!' } });
    }

    try {
      // user_id extracted from token
      const projects = await Project.findOne({
        where: { id: project_id },
        include: {
          model: Scale,
          as: 'scale',
          attributes: ['id', 'description'],
        },
      });

      return res.status(200).json(projects);
    } catch (error) {
      return res.status(200).json({ error: { mensagem: 'Falha ao consultar projeto!' } });
    }
  }

  async delete(req, res) {
    const project_id = req.params.id;

    // verify if id is valid
    if (Number.isNaN(project_id)) {
      return res.status(400).json({ error: { mensagem: 'Project id Inválido!' } });
    }

    try {
      // delete project
      await Project.destroy({
        where: {
          id: project_id,
        },
      });

      return res.status(200).json({ success: { mensagem: 'Removido com Sucesso!' } });
    } catch (error) {
      return res.status(400).json({ error: { mensagem: 'Erro ao deletar Projeto!' } });
    }
  }
}

export default new ProjectController();
