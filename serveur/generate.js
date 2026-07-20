// generateHash.js
import bcrypt from 'bcrypt';

const password = 'superadmin123';
const saltRounds = 10;
const hash = await bcrypt.hash(password, saltRounds);
console.log('Hash à insérer :', hash);