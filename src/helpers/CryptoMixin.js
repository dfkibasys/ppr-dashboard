import bcrypt from 'bcryptjs';

export default {
    methods: {
        hash(password) {
            const salt = bcrypt.genSaltSync(10);
            return bcrypt.hashSync(password, salt);
        },
        verify(password, hash) {
            return bcrypt.compareSync(password, hash)
        }

    }
}