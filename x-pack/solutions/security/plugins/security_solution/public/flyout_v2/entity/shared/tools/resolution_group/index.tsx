/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React, { memo } from 'react';
import { EuiFlyoutBody, EuiFlyoutHeader } from '@elastic/eui';
import { i18n } from '@kbn/i18n';
import { EntityType } from '../../../../../../common/entity_analytics/types';
import { ResolutionGroupTab } from '../../../../../entity_analytics/components/flyout_v2/entity_resolution/resolution_group_tab';
import { ToolsFlyoutHeader } from '../../../../shared/components/tools_flyout_header';
import { RESOLUTION_GROUP_TOOL_TEST_ID } from './test_ids';

const TITLE = i18n.translate('xpack.securitySolution.flyout.entityDetails.resolution.title', {
  defaultMessage: 'Resolution',
});

const ICON_TYPE = { [EntityType.host]: 'storage', [EntityType.user]: 'user' } as const;

export interface ResolutionGroupProps {
  /** Whether this tool is scoped to a host or user entity. Controls the icon passed to the header. */
  entityType: EntityType.host | EntityType.user;
  /** Display name of the entity (typically `host.name` or `user.name`). */
  entityName: string;
  /** Entity Store v2 id (`entity.id`) for the entity whose resolution group to display. */
  entityId: string;
  /** Opens the originating entity flyout as a child. */
  onOpen?: () => void;
  /** Called when a user clicks an entity name in the resolution group table. */
  onEntityNameClick: (entity: Record<string, unknown>) => void;
}

export const ResolutionGroup = memo(
  ({ entityType, entityName, entityId, onOpen, onEntityNameClick }: ResolutionGroupProps) => (
    <>
      <EuiFlyoutHeader hasBorder>
        <ToolsFlyoutHeader
          title={TITLE}
          onTitleClick={onOpen}
          label={entityName}
          iconType={ICON_TYPE[entityType]}
        />
      </EuiFlyoutHeader>
      <EuiFlyoutBody data-test-subj={RESOLUTION_GROUP_TOOL_TEST_ID}>
        <ResolutionGroupTab
          entityId={entityId}
          entityType={entityType}
          onEntityNameClick={onEntityNameClick}
        />
      </EuiFlyoutBody>
    </>
  )
);

ResolutionGroup.displayName = 'ResolutionGroup';
