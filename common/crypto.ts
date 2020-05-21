import bcrypt from 'bcrypt';
import environment from './environment';

const crypto = (rawValue: string): Promise<string> => {
    return bcrypt.hash(rawValue, environment.security.saltRounds);
}

export default crypto;