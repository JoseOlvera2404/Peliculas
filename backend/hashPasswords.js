const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

const saltRounds = 10;

async function hashPasswords() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'peliculas_db'
  });

  const [users] = await connection.execute(
    'SELECT id, password FROM usuarios'
  );

  for (const user of users) {
    // Si ya está hasheada (bcrypt empieza con $2b$ o $2a$), la saltamos
    if (user.password.startsWith('$2')) {
      console.log(`Usuario ${user.id} ya está hasheado`);
      continue;
    }

    const hashedPassword = await bcrypt.hash(user.password, saltRounds);

    await connection.execute(
      'UPDATE usuarios SET password = ? WHERE id = ?',
      [hashedPassword, user.id]
    );

    console.log(`Usuario ${user.id} actualizado`);
  }

  await connection.end();
  console.log('Proceso terminado ✅');
}

hashPasswords();