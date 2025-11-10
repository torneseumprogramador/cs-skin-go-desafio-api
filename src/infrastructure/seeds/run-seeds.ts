import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { Case } from '../../domain/entities/case.entity';
import { Skin } from '../../domain/entities/skin.entity';
import { User } from '../../domain/entities/user.entity';
import { casesSeedData } from './cases-seed.data';
import { defaultUserSeed, hashPassword } from './user-seed.data';

// Carregar variáveis de ambiente
config();

async function runSeeds() {
  console.log('🌱 Iniciando seeds...');

  const dataSource = new DataSource({
    type: 'mysql',
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT || '3306'),
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    entities: [Case, Skin, User],
    synchronize: false,
  });

  try {
    await dataSource.initialize();
    console.log('✅ Conexão com banco estabelecida');

    const userRepository = dataSource.getRepository(User);
    const caseRepository = dataSource.getRepository(Case);
    const skinRepository = dataSource.getRepository(Skin);

    // Limpar dados existentes (opcional)
    console.log('🗑️  Limpando dados existentes...');
    await skinRepository.clear();
    await caseRepository.clear();

    // Inserir usuário padrão
    console.log('👤 Inserindo usuário padrão...');
    
    // Verificar se o usuário já existe
    const existingUser = await userRepository.findOne({ where: { email: defaultUserSeed.email } });
    
    if (!existingUser) {
      const hashedPassword = await hashPassword(defaultUserSeed.password);
      const user = userRepository.create({
        name: defaultUserSeed.name,
        email: defaultUserSeed.email,
        password: hashedPassword,
      });
      await userRepository.save(user);
      console.log(`   ✓ Usuário "${user.email}" criado`);
    } else {
      console.log(`   ℹ️  Usuário "${defaultUserSeed.email}" já existe`);
    }

    // Inserir cases e skins
    console.log('📦 Inserindo cases e skins...');

    for (const caseData of casesSeedData) {
      const { skins, ...caseInfo } = caseData;

      // Criar case
      const caseEntity = caseRepository.create(caseInfo);
      await caseRepository.save(caseEntity);

      console.log(`   ✓ Case "${caseEntity.name}" criado`);

      // Criar skins do case
      for (const skinData of skins) {
        const skin = skinRepository.create({
          caseId: caseEntity.id,
          name: skinData.name,
          weapon: skinData.weapon,
          rarity: skinData.rarity as any,
          chance: skinData.chance,
          image: skinData.image,
        });
        await skinRepository.save(skin);
      }

      console.log(`   ✓ ${skins.length} skins adicionadas ao case "${caseEntity.name}"`);
    }

    console.log('');
    console.log('✅ Seeds executados com sucesso!');
    console.log(`   Total de cases: ${casesSeedData.length}`);
    console.log(`   Total de skins: ${casesSeedData.reduce((sum, c) => sum + c.skins.length, 0)}`);
  } catch (error) {
    console.error('❌ Erro ao executar seeds:', error);
    process.exit(1);
  } finally {
    await dataSource.destroy();
  }
}

runSeeds();

