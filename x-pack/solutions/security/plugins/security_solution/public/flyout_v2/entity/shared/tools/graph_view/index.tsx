/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React, { memo, useCallback } from 'react';
import { EuiFlyoutBody, EuiFlyoutHeader } from '@elastic/eui';
import { i18n } from '@kbn/i18n';
import { useStore } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { DOC_VIEWER_FLYOUT_HISTORY_KEY } from '@kbn/unified-doc-viewer';
import { EntityType } from '../../../../../../common/entity_analytics/types';
import { GraphViewTab } from '../../../../../flyout/entity_details/shared/components/left/graph_view_tab';
import { ToolsFlyoutHeader } from '../../../../shared/components/tools_flyout_header';
import { GRAPH_VIEW_TOOL_TEST_ID } from './test_ids';
import { useKibana } from '../../../../../common/lib/kibana';
import { useIsInSecurityApp } from '../../../../../common/hooks/is_in_security_app';
import { flyoutProviders } from '../../../../shared/components/flyout_provider';
import { useDefaultDocumentFlyoutProperties } from '../../../../shared/hooks/use_default_flyout_properties';
import { documentFlyoutHistoryKey } from '../../../../shared/constants/flyout_history';
import { Host } from '../../../host/main';
import { User } from '../../../user/main';

const TITLE = i18n.translate('xpack.securitySolution.flyout.entityDetails.graphView.title', {
  defaultMessage: 'Visualizations',
});

const ICON_TYPE = { [EntityType.host]: 'storage', [EntityType.user]: 'user' } as const;

export interface GraphViewProps {
  /** Whether this tool is scoped to a host or user entity. Controls the icon passed to the header. */
  entityType: EntityType.host | EntityType.user;
  /** Display name of the entity (typically `host.name` or `user.name`). */
  entityName: string;
  /** Entity Store v2 id (`entity.id`) to center the graph on. */
  entityId: string;
  /** Scope id (timeline id, table id, etc.) passed to the graph. */
  scopeId: string;
  /** Opens the originating entity flyout as a child. */
  onOpen?: () => void;
}

export const GraphView = memo(
  ({ entityType, entityName, entityId, scopeId, onOpen }: GraphViewProps) => {
    const { services } = useKibana();
    const { overlays } = services;
    const store = useStore();
    const history = useHistory();
    const isInSecurityApp = useIsInSecurityApp();
    const historyKey = isInSecurityApp ? documentFlyoutHistoryKey : DOC_VIEWER_FLYOUT_HISTORY_KEY;
    const defaultFlyoutProperties = useDefaultDocumentFlyoutProperties();

    const onOpenEntityPreview = useCallback(
      ({
        engineType,
        entityId: nodeEntityId,
        entityName: nodeEntityName,
      }: {
        engineType: string | undefined;
        entityId: string;
        entityName: string | undefined;
      }) => {
        let child: React.ReactNode;
        if (engineType === 'host') {
          child = (
            <Host hostName={nodeEntityName ?? ''} entityId={nodeEntityId} scopeId={scopeId} />
          );
        } else if (engineType === 'user') {
          child = (
            <User userName={nodeEntityName ?? ''} entityId={nodeEntityId} scopeId={scopeId} />
          );
        } else {
          return;
        }
        overlays.openSystemFlyout(flyoutProviders({ services, store, history, children: child }), {
          ...defaultFlyoutProperties,
          title: nodeEntityName,
          historyKey,
          session: 'inherit',
        });
      },
      [overlays, services, store, history, historyKey, defaultFlyoutProperties, scopeId]
    );

    return (
      <>
        <EuiFlyoutHeader hasBorder>
          <ToolsFlyoutHeader
            title={TITLE}
            onTitleClick={onOpen}
            label={entityName}
            iconType={ICON_TYPE[entityType]}
          />
        </EuiFlyoutHeader>
        <EuiFlyoutBody data-test-subj={GRAPH_VIEW_TOOL_TEST_ID}>
          <GraphViewTab
            entityId={entityId}
            scopeId={scopeId}
            onOpenEntityPreview={onOpenEntityPreview}
          />
        </EuiFlyoutBody>
      </>
    );
  }
);

GraphView.displayName = 'GraphView';
