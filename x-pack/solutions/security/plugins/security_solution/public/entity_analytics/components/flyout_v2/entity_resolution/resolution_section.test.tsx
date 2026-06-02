/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { TestProviders } from '../../../../common/mock';
import { ResolutionSection } from './resolution_section';
import {
  RESOLUTION_SECTION_TEST_ID,
  RESOLUTION_EMPTY_STATE_TEST_ID,
} from '../../entity_resolution/test_ids';
import { useResolutionGroup } from '../../entity_resolution/hooks/use_resolution_group';

jest.mock('../../entity_resolution/hooks/use_resolution_group');

const mockUseResolutionGroup = useResolutionGroup as jest.Mock;

describe('ResolutionSection (v2)', () => {
  const openDetailsPanel = jest.fn();
  const defaultProps = {
    entityId: 'alice-id',
    openDetailsPanel,
  };

  beforeEach(() => jest.clearAllMocks());

  it('renders accordion with resolution group table', () => {
    mockUseResolutionGroup.mockReturnValue({
      data: {
        target: { 'entity.name': 'alice', 'entity.id': 'alice-id' },
        aliases: [{ 'entity.name': 'alice-azure', 'entity.id': 'alice-azure-id' }],
        group_size: 2,
      },
      isLoading: false,
    });

    const { getByTestId, getByText } = render(
      <TestProviders>
        <ResolutionSection {...defaultProps} />
      </TestProviders>
    );

    expect(getByTestId(RESOLUTION_SECTION_TEST_ID)).toBeInTheDocument();
    expect(getByText('alice')).toBeInTheDocument();
  });

  it('shows loading spinner while loading', () => {
    mockUseResolutionGroup.mockReturnValue({ data: undefined, isLoading: true });

    const { container } = render(
      <TestProviders>
        <ResolutionSection {...defaultProps} />
      </TestProviders>
    );

    expect(container.querySelector('[role="progressbar"]')).toBeInTheDocument();
  });

  it('shows empty state when no resolution group', () => {
    mockUseResolutionGroup.mockReturnValue({
      data: { target: { 'entity.id': 'alice-id' }, aliases: [], group_size: 1 },
      isLoading: false,
    });

    const { getByTestId } = render(
      <TestProviders>
        <ResolutionSection {...defaultProps} />
      </TestProviders>
    );

    expect(getByTestId(RESOLUTION_EMPTY_STATE_TEST_ID)).toBeInTheDocument();
  });

  it('calls onEntityNameClick when an entity name is clicked', () => {
    const onEntityNameClick = jest.fn();
    mockUseResolutionGroup.mockReturnValue({
      data: {
        target: { 'entity.name': 'alice', 'entity.id': 'alice-id' },
        aliases: [{ 'entity.name': 'alice-azure', 'entity.id': 'alice-azure-id' }],
        group_size: 2,
      },
      isLoading: false,
    });

    const { getByText } = render(
      <TestProviders>
        <ResolutionSection {...defaultProps} onEntityNameClick={onEntityNameClick} />
      </TestProviders>
    );

    fireEvent.click(getByText('alice-azure'));
    expect(onEntityNameClick).toHaveBeenCalledWith(
      expect.objectContaining({ 'entity.name': 'alice-azure', 'entity.id': 'alice-azure-id' })
    );
  });

  it('does not render the arrowStart icon in the panel header', () => {
    mockUseResolutionGroup.mockReturnValue({
      data: {
        target: { 'entity.name': 'alice', 'entity.id': 'alice-id' },
        aliases: [],
        group_size: 1,
      },
      isLoading: false,
    });

    const { container } = render(
      <TestProviders>
        <ResolutionSection {...defaultProps} />
      </TestProviders>
    );

    expect(container.querySelector('[data-euiicon-type="arrowStart"]')).not.toBeInTheDocument();
  });
});
