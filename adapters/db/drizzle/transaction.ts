import type {Tx} from '@core/interfaces/tx';

import {getDb} from '@/app/lib/db';

import {createDrizzleAdminUserRepository} from './admin-user.repository';
import {createDrizzleContactRepository} from './contact.repository';

export const drizzleTx: Tx = async (operation) => {
    const db = await getDb();
    return db.transaction(async (transaction) =>
        operation({
            contactRepository: createDrizzleContactRepository(transaction),
            adminUserRepository: createDrizzleAdminUserRepository(transaction),
        }),
    );
};
