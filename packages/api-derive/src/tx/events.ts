// Copyright 2017-2020 @polkadot/api-derive authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Observable } from 'rxjs';
import type { EventRecord, Hash, SignedBlock } from '@polkadot/types/interfaces';

import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiInterfaceRx } from '@polkadot/api/types';

import { memo } from '../util';

interface Result {
  block: SignedBlock;
  events: EventRecord[];
}

export function events (instanceId: string, api: ApiInterfaceRx): (at: Hash) => Observable<Result> {
  return memo(instanceId, (at: Hash): Observable<Result> =>
    combineLatest([
      api.query.system.events.at(at),
      api.rpc.chain.getBlock(at)
    ]).pipe(
      map(([events, block]) => ({
        block,
        events
      }))
    )
  );
}
