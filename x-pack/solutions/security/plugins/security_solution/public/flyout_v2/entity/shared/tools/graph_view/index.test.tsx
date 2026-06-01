/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React from 'react';
import { render } from '@testing-library/react';
import { EntityType } from '../../../../../../common/entity_analytics/types';
import { GraphView } from '.';
import { GRAPH_VIEW_TOOL_TEST_ID } from './test_ids';

jest.mock('../../../../../common/lib/kibana', () => ({
  useKibana: () => ({
    services: { overlays: { openSystemFlyout: jest.fn() } },
  }),
}));
jest.mock('react-redux', () => ({ useStore: () => ({}) }));
jest.mock('react-router-dom', () => ({ useHistory: () => ({}) }));
jest.mock('../../../../../common/hooks/is_in_security_app', () => ({
  useIsInSecurityApp: () => true,
}));
jest.mock('../../../../shared/hooks/use_default_flyout_properties', () => ({
  useDefaultDocumentFlyoutProperties: () => ({}),
}));
jest.mock('../../../../shared/components/flyout_provider', () => ({
  flyoutProviders: jest.fn(),
}));
jest.mock('../../../host/main', () => ({ Host: () => null }));
jest.mock('../../../user/main', () => ({ User: () => null }));
jest.mock('../../../../shared/constants/flyout_history', () => ({
  documentFlyoutHistoryKey: 'doc-flyout',
}));
jest.mock('@kbn/unified-doc-viewer', () => ({ DOC_VIEWER_FLYOUT_HISTORY_KEY: 'unified-doc' }));

jest.mock('../../../../shared/components/tools_flyout_header', () => ({
  ToolsFlyoutHeader: ({
    title,
    label,
    iconType,
    onTitleClick,
  }: {
    title: string;
    label?: string;
    iconType?: string;
    onTitleClick?: () => void;
  }) => (
    <button
      type="button"
      data-test-subj="mockToolsFlyoutHeader"
      data-title={title}
      data-label={label}
      data-icon-type={iconType}
      onClick={onTitleClick}
    />
  ),
}));

jest.mock(
  '../../../../../flyout/entity_details/shared/components/left/graph_view_tab',
  () => ({
    GraphViewTab: ({
      entityId,
      scopeId,
    }: {
      entityId: string;
      scopeId: string;
    }) => (
      <div
        data-test-subj="mockGraphViewTab"
        data-entity-id={entityId}
        data-scope-id={scopeId}
      />
    ),
  })
);

describe('<GraphView /> host', () => {
  it('renders with storage icon for host entity type', () => {
    const { getByTestId } = render(
      <GraphView
        entityType={EntityType.host}
        entityName="my-host"
        entityId="euid-123"
        scopeId="scope"
      />
    );
    expect(getByTestId('mockToolsFlyoutHeader')).toHaveAttribute('data-title', 'Visualizations');
    expect(getByTestId('mockToolsFlyoutHeader')).toHaveAttribute('data-label', 'my-host');
    expect(getByTestId('mockToolsFlyoutHeader')).toHaveAttribute('data-icon-type', 'storage');
  });

  it('renders the graph view body container', () => {
    const { getByTestId } = render(
      <GraphView
        entityType={EntityType.host}
        entityName="my-host"
        entityId="euid-123"
        scopeId="scope"
      />
    );
    expect(getByTestId(GRAPH_VIEW_TOOL_TEST_ID)).toBeInTheDocument();
  });

  it('passes entity context to GraphViewTab', () => {
    const { getByTestId } = render(
      <GraphView
        entityType={EntityType.host}
        entityName="my-host"
        entityId="euid-123"
        scopeId="my-scope"
      />
    );
    const tab = getByTestId('mockGraphViewTab');
    expect(tab).toHaveAttribute('data-entity-id', 'euid-123');
    expect(tab).toHaveAttribute('data-scope-id', 'my-scope');
  });

  it('forwards onOpen to the header click handler', () => {
    const onOpen = jest.fn();
    const { getByTestId } = render(
      <GraphView
        entityType={EntityType.host}
        entityName="my-host"
        entityId="euid-123"
        scopeId="scope"
        onOpen={onOpen}
      />
    );
    getByTestId('mockToolsFlyoutHeader').click();
    expect(onOpen).toHaveBeenCalledTimes(1);
  });
});

describe('<GraphView /> user', () => {
  it('renders with user icon for user entity type', () => {
    const { getByTestId } = render(
      <GraphView
        entityType={EntityType.user}
        entityName="my-user"
        entityId="euid-456"
        scopeId="scope"
      />
    );
    expect(getByTestId('mockToolsFlyoutHeader')).toHaveAttribute('data-icon-type', 'user');
  });

  it('renders the graph view body container for user', () => {
    const { getByTestId } = render(
      <GraphView
        entityType={EntityType.user}
        entityName="my-user"
        entityId="euid-456"
        scopeId="scope"
      />
    );
    expect(getByTestId(GRAPH_VIEW_TOOL_TEST_ID)).toBeInTheDocument();
  });

  it('passes user entity context to GraphViewTab', () => {
    const { getByTestId } = render(
      <GraphView
        entityType={EntityType.user}
        entityName="my-user"
        entityId="euid-456"
        scopeId="my-scope"
      />
    );
    const tab = getByTestId('mockGraphViewTab');
    expect(tab).toHaveAttribute('data-entity-id', 'euid-456');
    expect(tab).toHaveAttribute('data-scope-id', 'my-scope');
  });

  it('forwards onOpen to the header click handler for user', () => {
    const onOpen = jest.fn();
    const { getByTestId } = render(
      <GraphView
        entityType={EntityType.user}
        entityName="my-user"
        entityId="euid-456"
        scopeId="scope"
        onOpen={onOpen}
      />
    );
    getByTestId('mockToolsFlyoutHeader').click();
    expect(onOpen).toHaveBeenCalledTimes(1);
  });
});
