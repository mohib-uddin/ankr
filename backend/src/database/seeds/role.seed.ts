import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Role } from 'src/roles/entities/role.entity';

export default class RoleSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager
  ): Promise<any> {
    const roleRepository = dataSource.getRepository(Role);

    const roles = [
      {
        key: 'investor-role',
        name: 'Investor',
        description: 'Standard Individual Investor Profile',
      },
    ];

    for (const roleData of roles) {
      const existing = await roleRepository.findOne({ where: { key: roleData.key } });
      if (!existing) {
        await roleRepository.save(roleRepository.create(roleData));
        console.log(`Role seeded: ${roleData.key}`);
      }
    }
  }
}
