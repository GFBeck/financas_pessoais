import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';

const usersPath = path.join(process.cwd(), 'users.json');

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}

interface UsersDatabase {
  users: User[];
}

function readUsers(): UsersDatabase {
  try {
    if (fs.existsSync(usersPath)) {
      const data = fs.readFileSync(usersPath, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Erro ao ler users.json:', error);
  }
  return { users: [] };
}

function writeUsers(data: UsersDatabase): void {
  fs.writeFileSync(usersPath, JSON.stringify(data, null, 2), 'utf-8');
}

export const usersDb = {
  findByEmail(email: string): User | null {
    const data = readUsers();
    return data.users.find(u => u.email === email) || null;
  },

  async createUser(name: string, email: string, password: string): Promise<User> {
    const data = readUsers();

    // Verificar se email já existe
    if (data.users.find(u => u.email === email)) {
      throw new Error('Email já cadastrado');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser: User = {
      id: randomUUID(),
      name,
      email,
      password: hashedPassword,
    };

    data.users.push(newUser);
    writeUsers(data);
    return newUser;
  },

  async validatePassword(email: string, password: string): Promise<User | null> {
    const user = this.findByEmail(email);
    if (!user) return null;

    const isValid = await bcrypt.compare(password, user.password);
    return isValid ? user : null;
  },
};
