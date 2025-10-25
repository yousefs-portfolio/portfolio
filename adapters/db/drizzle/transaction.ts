import type {Tx} from '@core/interfaces/tx';

import {db, sqlite} from '@/drizzle/db';

import {createDrizzleAdminUserRepository} from './admin-user.repository';
import {createDrizzleContactRepository} from './contact.repository';

export const drizzleTx: Tx = async (operation) => {
    sqlite.exec('BEGIN');
    try {
        const result = await operation({
            contactRepository: createDrizzleContactRepository(db),
            adminUserRepository: createDrizzleAdminUserRepository(db),
        });
        sqlite.exec('COMMIT');
        return result;
    } catch (error) {
        sqlite.exec('ROLLBACK');
        throw error;
    }
};
