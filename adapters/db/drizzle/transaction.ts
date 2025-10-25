import type {Tx} from '@core/interfaces/tx';

import {db} from '@/drizzle/db';

import {createDrizzleAdminUserRepository} from './admin-user.repository';
import {createDrizzleContactRepository} from './contact.repository';

export const drizzleTx: Tx = (operation) =>
    db.transaction((tx) =>
        operation({
            contactRepository: createDrizzleContactRepository(tx),
            adminUserRepository: createDrizzleAdminUserRepository(tx),
        }),
    );
