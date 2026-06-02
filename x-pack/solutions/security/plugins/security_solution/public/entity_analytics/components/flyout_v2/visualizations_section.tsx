/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React, { memo, useCallback } from 'react';
import { TableId } from '@kbn/securitysolution-data-table';
import { FLYOUT_STORAGE_KEYS } from '../../../flyout_v2/document/main/constants/local_storage';
import { useExpandSection } from '../../../flyout_v2/shared/hooks/use_expand_section';
import { ExpandableSection } from '../../../flyout_v2/shared/components/expandable_section';
import {
  VISUALIZATION_SECTION_TEST_ID,
  VISUALIZATION_SECTION_TITLE,
} from '../../../flyout_v2/document/main/components/visualizations_section';
import { useShouldShowGraph } from '../../../flyout/shared/hooks/use_should_show_graph';
import {
  EntityDetailsLeftPanelTab,
  type EntityDetailsPath,
} from '../../../flyout/entity_details/shared/components/left_panel/left_panel_header';
import { EntityGraphPreviewContainer } from '../../../flyout/entity_details/shared/components/right/entity_graph_preview_container';

const KEY = 'visualizations';

/**
 * Visualizations section for the v2 entity flyout. Header icon is always hidden.
 */
export const VisualizationsSection = memo(
  ({
    entityId,
    isPreviewMode,
    scopeId,
    openDetailsPanel,
  }: {
    entityId: string;
    isPreviewMode: boolean;
    scopeId: string;
    openDetailsPanel?: (path: EntityDetailsPath) => void;
  }) => {
    const expanded = useExpandSection({
      storageKey: FLYOUT_STORAGE_KEYS.OVERVIEW_TAB_EXPANDED_SECTIONS,
      title: KEY,
      defaultValue: false,
    });
    const shouldShowGraph = useShouldShowGraph();
    const handleOpenGraphViewTab = useCallback(() => {
      openDetailsPanel?.({ tab: EntityDetailsLeftPanelTab.GRAPH_VIEW });
    }, [openDetailsPanel]);

    return (
      <>
        {shouldShowGraph && (
          <ExpandableSection
            expanded={expanded}
            title={VISUALIZATION_SECTION_TITLE}
            localStorageKey={FLYOUT_STORAGE_KEYS.OVERVIEW_TAB_EXPANDED_SECTIONS}
            sectionId={KEY}
            data-test-subj={VISUALIZATION_SECTION_TEST_ID}
          >
            <EntityGraphPreviewContainer
              entityId={entityId}
              showIcon={false}
              disableNavigation={isPreviewMode || scopeId === TableId.rulePreview}
              onShowGraph={handleOpenGraphViewTab}
            />
          </ExpandableSection>
        )}
      </>
    );
  }
);

VisualizationsSection.displayName = 'VisualizationsSection';
