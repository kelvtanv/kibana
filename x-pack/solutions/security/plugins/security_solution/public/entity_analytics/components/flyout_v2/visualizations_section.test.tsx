/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React from 'react';
import { render } from '@testing-library/react';
import { TestProviders } from '../../../common/mock';
import { VisualizationsSection } from './visualizations_section';
import { useExpandSection } from '../../../flyout_v2/shared/hooks/use_expand_section';
import { useShouldShowGraph } from '../../../flyout/shared/hooks/use_should_show_graph';
import { useFetchGraphData } from '@kbn/cloud-security-posture-graph/src/hooks';
import {
  VISUALIZATIONS_SECTION_CONTENT_TEST_ID,
  VISUALIZATIONS_SECTION_HEADER_TEST_ID,
} from '../../../flyout/entity_details/shared/components/right/test_ids';

jest.mock('../../../flyout_v2/shared/hooks/use_expand_section');
jest.mock('../../../flyout/shared/hooks/use_should_show_graph');
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => jest.fn(),
}));
jest.mock('@kbn/cloud-security-posture-graph/src/hooks', () => ({
  useFetchGraphData: jest.fn(),
}));
jest.mock('@kbn/cloud-security-posture-common/utils/ui_metrics', () => ({
  uiMetricService: { trackUiMetric: jest.fn() },
}));

const mockUseExpandSection = useExpandSection as jest.Mock;
const mockUseShouldShowGraph = useShouldShowGraph as jest.Mock;
const mockUseFetchGraphData = useFetchGraphData as jest.Mock;

const renderVisualizationsSection = (
  props: {
    isPreviewMode?: boolean;
    scopeId?: string;
  } = {}
) =>
  render(
    <TestProviders>
      <VisualizationsSection
        entityId="test-entity-id"
        isPreviewMode={props.isPreviewMode ?? false}
        scopeId={props.scopeId ?? 'test-scope'}
      />
    </TestProviders>
  );

describe('<VisualizationsSection /> (v2)', () => {
  beforeEach(() => {
    mockUseShouldShowGraph.mockReturnValue(true);
    mockUseFetchGraphData.mockReturnValue({
      isLoading: false,
      isError: false,
      data: { nodes: [], edges: [] },
    });
    mockUseExpandSection.mockReturnValue(false);
  });

  it('renders the visualizations section header', () => {
    const { getByTestId } = renderVisualizationsSection();

    expect(getByTestId(VISUALIZATIONS_SECTION_HEADER_TEST_ID)).toHaveTextContent('Visualizations');
  });

  it('renders collapsed when local storage value is false', () => {
    mockUseExpandSection.mockReturnValue(false);

    const { getByTestId } = renderVisualizationsSection();

    expect(getByTestId(VISUALIZATIONS_SECTION_CONTENT_TEST_ID)).not.toBeVisible();
  });

  it('renders expanded when local storage value is true', () => {
    mockUseExpandSection.mockReturnValue(true);

    const { getByTestId } = renderVisualizationsSection();

    expect(getByTestId(VISUALIZATIONS_SECTION_CONTENT_TEST_ID)).toBeVisible();
  });

  it('does not render when graph feature is disabled', () => {
    mockUseShouldShowGraph.mockReturnValue(false);

    const { queryByTestId } = renderVisualizationsSection();

    expect(queryByTestId(VISUALIZATIONS_SECTION_HEADER_TEST_ID)).not.toBeInTheDocument();
  });

  it('never renders the graph preview icon regardless of preview mode', () => {
    mockUseExpandSection.mockReturnValue(true);

    const { container: notPreview } = renderVisualizationsSection({ isPreviewMode: false });
    const { container: preview } = renderVisualizationsSection({ isPreviewMode: true });

    // showIcon is always false in v2 — the nav icon should never appear
    expect(notPreview.querySelector('[data-euiicon-type="expand"]')).not.toBeInTheDocument();
    expect(preview.querySelector('[data-euiicon-type="expand"]')).not.toBeInTheDocument();
  });
});
