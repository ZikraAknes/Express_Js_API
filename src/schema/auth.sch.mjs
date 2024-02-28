import { object, string, number, ref } from 'yup'

class _schemaAuth {
    schema_reg = object({
        name: string().required(),
        username: string().required(),
        password: string().required()
    });
    
    schema_log = object({
        username: string().required(),
        password: string().required()
    });
}

export default new _schemaAuth
