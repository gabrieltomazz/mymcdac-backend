import * as Yup from 'yup';

import Criteria from '../models/Criteria';
import Project from '../models/Project';

class CriteriaController {

    async store(req, res){
        
        const schema = Yup.object().shape({
            name: Yup.string().required(),
            criteria_id: Yup.number(),
        });

        try {
            await schema.validate(req.body, { abortEarly: false })
        } catch (error) {
            return res.status(400).json(error);
        }

        const criterion = req.body;
        criterion.project_id = req.params.id;
        
        //create criterion
        try {
            const { id, name, criteria_id, project_id } = await Criteria.create(criterion);
            
            return res.status(200).json({ 
                id,
                name,
                criteria_id,
                project_id
            });
        }catch (error){
            return res.status(400).json({ error: { mensagem: 'Erro! Falha ao salvar critério.'} });
        }

    }

    async getCriteriaByProjectId(req, res) {

        const project_id = req.params.id;

        // verify if id is valid
        if(isNaN(project_id)){
            return res.status(400).json({ error: { mensagem: 'Project id Inválido!'} });
        }

        try {
            const listCriteria = await Criteria.findAll({
                where : {project_id, criteria_id: null },
                include: {
                    model: Criteria,
                    as: 'criterian',
                    attributes: ['id','name','criteria_id'],
                    include: {
                        model: Criteria,
                        as: 'criterian',
                        attributes: ['id','name','criteria_id'],
                    }
                }
            });

            return res.status(200).json(listCriteria);
            
        } catch (error) {
            return res.status(400).json({ error: { mensagem: 'Erro! Falha ao buscar critério!'} });
        }

    }

}

export default new CriteriaController();