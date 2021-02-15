import Scale from '../models/Scale';
import OptionAnswer from '../models/OptionAnswer';

class ScaleController {

    async store(req, res) {

        const optionsAnswers = req.body;
        // create description
        const reducer = (description, arr, index) => index == 0 ?  arr.answer : description +' - '+ arr.answer;
        const description = optionsAnswers.reduce(reducer,'');

        // persist scale
        const { id }  = await Scale.create({
            user_id: req.userId,
            description
        });
        
        // insert id_scale on options
        for(const i in optionsAnswers){
            optionsAnswers[i]['scale_id'] = id;
        }
        
        // Persist options
        await OptionAnswer.bulkCreate(optionsAnswers).then(() => {
            return OptionAnswer.findAll({where: {scale_id: id} });
        }).then(options => {
            return res.status(200).json(options);
        });
        
    }

    async update(req, res) {

    }

    async getScaleAll(req, res) {

        const scale = await Scale.findAll();

        return res.json(scale);
    }

    async getScaleByUserId(req, res) {
        
    }

}

export default new ScaleController();