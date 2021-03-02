import * as Yup from 'yup';

import Criteria from '../models/Criteria';
import Project from '../models/Project';

class CriteriaController {

    async store(req, res){
        
        const schema = Yup.object().shape({
            name: Yup.string().required(),
            criteria_id: Yup.number(),
            project_id: Yup.number().required(),
        });

        try {
            await schema.validate(req.body, { abortEarly: false })
        } catch (error) {
            return res.status(400).json(error);
        }

        const criterion = req.body;
        
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


}

export default new CriteriaController();