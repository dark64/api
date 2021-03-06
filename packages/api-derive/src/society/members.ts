// Copyright 2017-2020 @polkadot/api-derive authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Observable } from 'rxjs';
import type { ApiInterfaceRx } from '@polkadot/api/types';
import type { AccountId } from '@polkadot/types/interfaces';
import type { DeriveSocietyMember } from '../types';

import { combineLatest } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { memo } from '../util';

/**
 * @description Get the member info for a society
 */
export function members (instanceId: string, api: ApiInterfaceRx): () => Observable<DeriveSocietyMember[]> {
  return memo(instanceId, (): Observable<DeriveSocietyMember[]> =>
    api.query.society.members<AccountId[]>().pipe(
      switchMap((members): Observable<DeriveSocietyMember[]> =>
        combineLatest(
          members.map((accountId): Observable<DeriveSocietyMember> =>
            api.derive.society.member(accountId)
          )
        )
      )
    )
  );
}
