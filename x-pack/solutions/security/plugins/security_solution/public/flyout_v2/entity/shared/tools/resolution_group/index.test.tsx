/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React from 'react';
import { render } from '@testing-library/react';
import { EntityType } from '../../../../../../common/entity_analytics/types';
import { ResolutionGroup } from '.';
import { RESOLUTION_GROUP_TOOL_TEST_ID } from './test_ids';

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
  '../../../../../entity_analytics/components/entity_resolution/resolution_group_tab',
  () => ({
    ResolutionGroupTab: ({
      entityId,
      entityType,
      scopeId,
      isInV2Flyout,
    }: {
      entityId: string;
      entityType: string;
      scopeId: string;
      isInV2Flyout?: boolean;
      onEntityNameClick?: (entity: Record<string, unknown>) => void;
    }) => (
      <div
        data-test-subj="mockResolutionGroupTab"
        data-entity-id={entityId}
        data-entity-type={entityType}
        data-scope-id={scopeId}
        data-is-in-v2-flyout={String(!!isInV2Flyout)}
      />
    ),
  })
);

describe('<ResolutionGroup /> host', () => {
  const noop = () => {};

  it('renders with storage icon for host entity type', () => {
    const { getByTestId } = render(
      <ResolutionGroup
        entityType={EntityType.host}
        entityName="my-host"
        entityId="euid-123"
        scopeId="scope"
        onEntityNameClick={noop}
      />
    );
    expect(getByTestId('mockToolsFlyoutHeader')).toHaveAttribute('data-title', 'Resolution');
    expect(getByTestId('mockToolsFlyoutHeader')).toHaveAttribute('data-label', 'my-host');
    expect(getByTestId('mockToolsFlyoutHeader')).toHaveAttribute('data-icon-type', 'storage');
  });

  it('renders the resolution group body container', () => {
    const { getByTestId } = render(
      <ResolutionGroup
        entityType={EntityType.host}
        entityName="my-host"
        entityId="euid-123"
        scopeId="scope"
        onEntityNameClick={noop}
      />
    );
    expect(getByTestId(RESOLUTION_GROUP_TOOL_TEST_ID)).toBeInTheDocument();
  });

  it('passes entity context to ResolutionGroupTab with isInV2Flyout=true', () => {
    const { getByTestId } = render(
      <ResolutionGroup
        entityType={EntityType.host}
        entityName="my-host"
        entityId="euid-123"
        scopeId="my-scope"
        onEntityNameClick={noop}
      />
    );
    const tab = getByTestId('mockResolutionGroupTab');
    expect(tab).toHaveAttribute('data-entity-id', 'euid-123');
    expect(tab).toHaveAttribute('data-entity-type', 'host');
    expect(tab).toHaveAttribute('data-scope-id', 'my-scope');
    expect(tab).toHaveAttribute('data-is-in-v2-flyout', 'true');
  });

  it('forwards onOpen to the header click handler', () => {
    const onOpen = jest.fn();
    const { getByTestId } = render(
      <ResolutionGroup
        entityType={EntityType.host}
        entityName="my-host"
        entityId="euid-123"
        scopeId="scope"
        onOpen={onOpen}
        onEntityNameClick={noop}
      />
    );
    getByTestId('mockToolsFlyoutHeader').click();
    expect(onOpen).toHaveBeenCalledTimes(1);
  });
});

describe('<ResolutionGroup /> user', () => {
  const noop = () => {};

  it('renders with user icon for user entity type', () => {
    const { getByTestId } = render(
      <ResolutionGroup
        entityType={EntityType.user}
        entityName="my-user"
        entityId="euid-456"
        scopeId="scope"
        onEntityNameClick={noop}
      />
    );
    expect(getByTestId('mockToolsFlyoutHeader')).toHaveAttribute('data-icon-type', 'user');
  });

  it('renders the resolution group body container for user', () => {
    const { getByTestId } = render(
      <ResolutionGroup
        entityType={EntityType.user}
        entityName="my-user"
        entityId="euid-456"
        scopeId="scope"
        onEntityNameClick={noop}
      />
    );
    expect(getByTestId(RESOLUTION_GROUP_TOOL_TEST_ID)).toBeInTheDocument();
  });

  it('passes user entity context to ResolutionGroupTab', () => {
    const { getByTestId } = render(
      <ResolutionGroup
        entityType={EntityType.user}
        entityName="my-user"
        entityId="euid-456"
        scopeId="my-scope"
        onEntityNameClick={noop}
      />
    );
    const tab = getByTestId('mockResolutionGroupTab');
    expect(tab).toHaveAttribute('data-entity-type', 'user');
    expect(tab).toHaveAttribute('data-entity-id', 'euid-456');
  });

  it('forwards onOpen to the header click handler for user', () => {
    const onOpen = jest.fn();
    const { getByTestId } = render(
      <ResolutionGroup
        entityType={EntityType.user}
        entityName="my-user"
        entityId="euid-456"
        scopeId="scope"
        onOpen={onOpen}
        onEntityNameClick={noop}
      />
    );
    getByTestId('mockToolsFlyoutHeader').click();
    expect(onOpen).toHaveBeenCalledTimes(1);
  });
});
