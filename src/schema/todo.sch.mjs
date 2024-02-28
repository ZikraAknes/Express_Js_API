import { object, string, number, ref } from 'yup'

class _schemaTodo{
    schema_add = object({
        title: string().required(),
        contents: string().required()
    });
    
    schema_edit = object({
        id: string().required(),
        title: string().required(),
        contents: string().required()
    });
}

export default new _schemaTodo