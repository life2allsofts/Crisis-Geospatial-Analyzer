import React from "react";
import { Document, Page, View, Text, StyleSheet, pdf } from "@react-pdf/renderer";
import { GeospatialStats, RiskAnalysisAiResponse } from "../types";

// Setup Timestamp & Unique Serial for professional touch
const timestamp = new Date().toISOString().replace(/T/, " ").replace(/\..+/, "");
const randId = Math.floor(1000 + Math.random() * 9000);
const serialNo = `NADMO-VEC-2026-${randId}`;

// Dynamic map of color themes per severity level
const severityColors: Record<string, string> = {
  CRITICAL: "#dc2626", // red-600
  HIGH: "#d97706",    // amber-600
  MEDIUM: "#4f46e5",  // indigo-600
  LOW: "#059669"      // emerald-600
};

// Stylesheet using standard PDF units (Points). A4 size is 595.28 x 841.89 points.
const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    paddingTop: 85, // Generous padding to clear the 55pt header safely
    paddingBottom: 85, // Generous padding to clear the 55pt footer safely
    paddingHorizontal: 36,
    backgroundColor: "#ffffff",
  },
  
  // Header Component (fixed on every page)
  headerContainer: {
    position: "absolute",
    top: 20,
    left: 36,
    right: 36,
    height: 55,
  },
  flagContainer: {
    flexDirection: "row",
    height: 3,
    width: "100%",
  },
  flagBar: {
    flex: 1,
  },
  headerFlex: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },
  headerLeft: {
    flexDirection: "column",
    flex: 1,
    paddingRight: 10,
  },
  headerSub: {
    fontSize: 6.5,
    fontFamily: "Helvetica-Bold",
    color: "#64748b",
  },
  headerTitle: {
    fontSize: 10.5,
    fontFamily: "Helvetica-Bold",
    color: "#0f172a",
    marginTop: 2,
  },
  headerSubTitle: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#4f46e5",
    marginTop: 2,
  },
  headerRight: {
    width: 140,
    padding: 4,
    backgroundColor: "#f8fafc",
    borderColor: "#e2e8f0",
    borderWidth: 0.5,
    borderRadius: 3,
    alignItems: "flex-start",
  },
  serialText: {
    fontSize: 6.5,
    fontFamily: "Helvetica-Bold",
    color: "#0f172a",
  },
  dateText: {
    fontSize: 5.5,
    color: "#64748b",
    marginTop: 1.5,
  },
  classText: {
    fontSize: 5.5,
    fontFamily: "Helvetica-Bold",
    color: "#10b981",
    marginTop: 1.5,
  },
  divider: {
    borderBottomWidth: 0.5,
    borderBottomColor: "#cbd5e1",
    marginTop: 6,
  },
  
  // Footer Component (fixed on every page)
  footerContainer: {
    position: "absolute",
    bottom: 20,
    left: 36,
    right: 36,
    height: 55,
    justifyContent: "flex-end",
  },
  footerLine: {
    borderBottomWidth: 0.5,
    borderBottomColor: "#cbd5e1",
    marginBottom: 5,
  },
  disclaimer: {
    fontSize: 5.5,
    color: "#64748b",
    lineHeight: 1.3,
  },
  footerMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },
  footerMetaText: {
    fontSize: 6.5,
    fontFamily: "Helvetica-Bold",
    color: "#64748b",
  },
  pageNumber: {
    fontSize: 6.5,
    fontFamily: "Helvetica-Bold",
    color: "#64748b",
  },

  // Page 1: Telemetry & General positioning
  alertBanner: {
    backgroundColor: "#020617",
    padding: 8,
    borderRadius: 4,
    borderLeftWidth: 3,
    marginBottom: 12,
  },
  alertTitle: {
    color: "#ffffff",
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
  },
  alertSub: {
    color: "#e2e8f0",
    fontSize: 7,
    marginTop: 3,
    lineHeight: 1.3,
  },

  // Grid system
  gridRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  card: {
    width: "48.5%",
    borderWidth: 0.5,
    borderColor: "#e2e8f0",
    borderRadius: 4,
    backgroundColor: "#fafafa",
    overflow: "hidden",
  },
  cardHeader: {
    backgroundColor: "#0f172a",
    paddingVertical: 3.5,
    paddingHorizontal: 6,
  },
  cardHeaderText: {
    color: "#ffffff",
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
  },
  cardBody: {
    padding: 6,
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 2.5,
    borderBottomWidth: 0.25,
    borderBottomColor: "#e2e8f0",
  },
  cardLabel: {
    fontSize: 7.2,
    color: "#64748b",
  },
  cardValue: {
    fontSize: 7.2,
    fontFamily: "Helvetica-Bold",
    color: "#0f172a",
  },

  // Sections
  sectionTitle: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#0f172a",
    marginBottom: 3,
    textTransform: "uppercase",
  },
  sectionSub: {
    fontSize: 7,
    color: "#64748b",
    marginBottom: 6,
  },

  // Tables
  table: {
    borderWidth: 0.5,
    borderColor: "#cbd5e1",
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 12,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#0f172a",
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  tableHeaderCol: {
    color: "#ffffff",
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 4.5,
    paddingHorizontal: 6,
    borderBottomWidth: 0.25,
    borderBottomColor: "#e2e8f0",
  },
  tableRowZebra: {
    flexDirection: "row",
    backgroundColor: "#f8fafc",
    paddingVertical: 4.5,
    paddingHorizontal: 6,
    borderBottomWidth: 0.25,
    borderBottomColor: "#e2e8f0",
  },
  tableCell: {
    fontSize: 7.2,
    color: "#334155",
  },
  tableCellBold: {
    fontSize: 7.2,
    fontFamily: "Helvetica-Bold",
    color: "#0f172a",
  },

  // Lists Factors
  factorsContainer: {
    marginBottom: 10,
  },
  factorItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 4,
  },
  factorDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 2.5,
    marginRight: 6,
  },
  factorLabel: {
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    color: "#0f172a",
    width: 110,
  },
  factorText: {
    fontSize: 7.5,
    color: "#475569",
    flex: 1,
    lineHeight: 1.25,
  },

  // Page 2: AI Report Styles
  aiSummaryBanner: {
    backgroundColor: "#f8fafc",
    borderColor: "#4f46e5",
    borderWidth: 0.5,
    borderRadius: 4,
    padding: 8,
    marginBottom: 12,
  },
  aiSummaryHeader: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#4f46e5",
    marginBottom: 4,
  },
  aiSummaryText: {
    fontSize: 7.5,
    color: "#334155",
    lineHeight: 1.35,
  },
  aiParagraph: {
    fontSize: 7.5,
    color: "#475569",
    lineHeight: 1.35,
    marginBottom: 12,
  },
  recRow: {
    flexDirection: "row",
    marginBottom: 5,
    alignItems: "flex-start",
  },
  recBadge: {
    backgroundColor: "#4f46e5",
    width: 10,
    height: 10,
    borderRadius: 2,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 6,
    marginTop: 1,
  },
  recBadgeText: {
    color: "#ffffff",
    fontSize: 6,
    fontFamily: "Helvetica-Bold",
  },
  recText: {
    fontSize: 7.5,
    color: "#334155",
    flex: 1,
    lineHeight: 1.3,
  },

  // Page 3: Safe Havens
  havenCard: {
    borderWidth: 0.5,
    borderColor: "#cbd5e1",
    borderRadius: 4,
    backgroundColor: "#ffffff",
    padding: 8,
    marginBottom: 8,
  },
  havenCardPrimary: {
    borderColor: "#4f46e5",
    backgroundColor: "#fafaff",
  },
  havenHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
    alignItems: "center",
  },
  havenTitle: {
    fontSize: 8.5,
    fontFamily: "Helvetica-Bold",
    color: "#0f172a",
  },
  havenBadge: {
    backgroundColor: "#4f46e5",
    paddingHorizontal: 5,
    paddingVertical: 1.5,
    borderRadius: 2,
  },
  havenBadgeText: {
    color: "#ffffff",
    fontSize: 5.5,
    fontFamily: "Helvetica-Bold",
  },
  havenBodyGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 5,
  },
  havenBodyCol: {
    width: "50%",
    marginBottom: 2,
  },
  havenLabel: {
    fontSize: 7,
    color: "#64748b",
  },
  havenValue: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    color: "#334155",
  },
  havenDistance: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#4f46e5",
  },
  routeBox: {
    backgroundColor: "#f1f5f9",
    padding: 4,
    borderRadius: 2,
    flexDirection: "row",
    marginTop: 2,
  },
  routeLabel: {
    fontSize: 6.5,
    fontFamily: "Helvetica-Bold",
    color: "#0f172a",
    width: 95,
  },
  routeValue: {
    fontSize: 6.5,
    color: "#475569",
    flex: 1,
  },
});

// Column widths definition for Population Table
const tableColWidths = {
  col1: "35%",
  col2: "20%",
  col3: "25%",
  col4: "20%"
};

// Column widths definition for Emergency Contacts Table
const hotlineColWidths = {
  service: "45%",
  shortcode: "20%",
  dispatch: "35%"
};

interface DocumentProps {
  stats: GeospatialStats;
  aiData: RiskAnalysisAiResponse | null;
}

/**
 * Declares the beautiful multi-page PDF document layout via JSX
 */
export const NADMO_DisasterBulletinDocument: React.FC<DocumentProps> = ({ stats, aiData }) => {
  const currentSeverityColor = severityColors[stats.evaluatedSeverity] || "#4f46e5";

  // Reusable Page Header
  const PageHeader = () => (
    <View style={styles.headerContainer} fixed>
      {/* Dynamic Colored Flag Accent Bar */}
      <View style={styles.flagContainer}>
        <View style={[styles.flagBar, { backgroundColor: "#CE1126" }]} />
        <View style={[styles.flagBar, { backgroundColor: "#FCD116" }]} />
        <View style={[styles.flagBar, { backgroundColor: "#006B3F" }]} />
      </View>
      <View style={styles.headerFlex}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerSub}>REPUBLIC OF GHANA • CIVIL DEFENSE PREPAREDNESS PLATFORM</Text>
          <Text style={styles.headerTitle}>NATIONAL DISASTER MANAGEMENT ORGANISATION (NADMO)</Text>
          <Text style={styles.headerSubTitle}>EMERGENCY HAZARD BULLETIN & GEOSPATIAL EXPOSURE REPORT</Text>
        </View>
        <View style={styles.headerRight}>
          <Text style={styles.serialText}>SERIAL: {serialNo}</Text>
          <Text style={styles.dateText}>GENERATED: {timestamp} UTC</Text>
          <Text style={styles.classText}>OFFICIAL CIVIL RECORD</Text>
        </View>
      </View>
      <View style={styles.divider} />
    </View>
  );

  // Reusable Page Footer
  const PageFooter = () => (
    <View style={styles.footerContainer} fixed>
      <View style={styles.footerLine} />
      <Text style={styles.disclaimer}>
        CONFIDENTIALITY NOTICE & DISCLAIMER: This document serves solely as an emergency geospatial planning resource. Zonal computations and risk profiles are calculated using satellite-derived model overlays (WorldPop, Sentinel and Google AI datasets). This report is not a legal substitute for direct ground surveys. In physical emergencies, please execute guidelines from on-site civil authorities.
      </Text>
      <View style={styles.footerMeta}>
        <Text style={styles.footerMetaText}>OFFICIAL USE ONLY • CIVIL SAFETY ALLOCATION RESOURCE</Text>
        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
      </View>
    </View>
  );

  // Table rows generation
  const scenarioLabel = stats.selectedScenario 
    ? `${stats.selectedScenario.rainfallFactor.toFixed(1)}x rainfall multiplier`
    : "Baseline Scenario";

  const rows = [
    {
      metric: "Baseline Population Density",
      val: `${stats.estimatedPopulationDensity.toFixed(1)} / km²`,
      coeff: "Standard 1.0x baseline",
      sev: stats.estimatedPopulationDensity > 500 ? "CRITICAL CONC." : "MODERATE"
    },
    {
      metric: "Estimated Residents Exposed",
      val: `${stats.estimatedPeopleExposed.toLocaleString()} people`,
      coeff: scenarioLabel,
      sev: stats.estimatedPeopleExposed > 1500 ? "HIGH HUMAN OVERLAY" : "SAFE BOUNDS"
    },
    {
      metric: "Structural Assets / Buildings",
      val: `${stats.estimatedBuildingsExposed.toLocaleString()} structures`,
      coeff: "Spatial footprint overlay",
      sev: stats.estimatedBuildingsExposed > 300 ? "SEVERE EXPOSURE" : "LOW IMPACT"
    },
    {
      metric: "Transport Road Networks",
      val: `${stats.estimatedRoadsExposedKm.toFixed(2)} km`,
      coeff: "Topological segments DB",
      sev: stats.estimatedRoadsExposedKm > 5 ? "VULNERABLE LOGISTICS" : "MINIMAL GRID"
    },
    {
      metric: "Displacement Estimate Projection",
      val: stats.estimatedDisplacedPeople ? `${stats.estimatedDisplacedPeople.toLocaleString()} displaced` : "N/A",
      coeff: stats.selectedScenario ? `${stats.selectedScenario.displacementCoef.toFixed(2)} displacement index` : "N/A",
      sev: stats.estimatedDisplacedPeople && stats.estimatedDisplacedPeople > 500 ? "CRITICAL SHELTER" : "MODERATE SHELTER"
    }
  ];

  // Emergency Hotlines list
  const hotlines = [
    { service: "NADMO National Headquarters Dispatch Desk", short: "112 / 193", direct: "0302 299350 / 0299 350030" },
    { service: "Ghana National Fire Service Operations", short: "192", direct: "0302 666576" },
    { service: "Ghana Ambulance Services Rescue Desk", short: "193", direct: "0302 682541" },
    { service: "Ghana Police Emergency Command Division", short: "191 / 18555", direct: "0302 773906" }
  ];

  return (
    <Document title={`NADMO Disaster Bulletin ${stats.latitude.toFixed(4)}_${stats.longitude.toFixed(4)}`}>
      
      {/* PAGE 1: TELEMETRY & GENERAL EXPOSURE MATRIX */}
      <Page size="A4" style={styles.page}>
        <PageHeader />
        
        {/* Risk Status Banner */}
        <View style={[styles.alertBanner, { borderLeftColor: currentSeverityColor }]}>
          <Text style={styles.alertTitle}>RISK SEVERITY CLASSIFICATION: {stats.evaluatedSeverity} LEVEL</Text>
          <Text style={styles.alertSub}>
            {stats.isInsideZone
              ? `CRITICAL ALERT: Selected site directly overlaps the active watershed margins of the "${stats.nearestFloodZone?.name}" zone (${stats.nearestFloodZone?.region} Region).`
              : `ADVISORY ALERT: Selected coordinate is outside major high-intensity basins (Proximity: ${stats.distanceToNearestZoneKm.toFixed(2)} km to ${stats.nearestFloodZone?.name || "nearest watercourse"}).`}
          </Text>
        </View>

        {/* Dynamic Spatial Data Cards Grid */}
        <View style={styles.gridRow}>
          {/* Card 1: Geolocation Coordinates */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardHeaderText}>COORDINATE GEOLOCATION TELEMETRY</Text>
            </View>
            <View style={styles.cardBody}>
              <View style={styles.cardRow}>
                <Text style={styles.cardLabel}>Latitude Decimal:</Text>
                <Text style={styles.cardValue}>{stats.latitude.toFixed(6)}° N</Text>
              </View>
              <View style={styles.cardRow}>
                <Text style={styles.cardLabel}>Longitude Decimal:</Text>
                <Text style={styles.cardValue}>{stats.longitude.toFixed(6)}° E</Text>
              </View>
              <View style={styles.cardRow}>
                <Text style={styles.cardLabel}>Local UTM Grid:</Text>
                <Text style={styles.cardValue}>UTM-30N Grid</Text>
              </View>
              <View style={styles.cardRow}>
                <Text style={styles.cardLabel}>Spatially Bound Region:</Text>
                <Text style={styles.cardValue}>{stats.nearestFloodZone?.region || "N/A"}</Text>
              </View>
              <View style={[styles.cardRow, { borderBottomWidth: 0 }]}>
                <Text style={styles.cardLabel}>Site Selection Mode:</Text>
                <Text style={styles.cardValue}>{stats.nearestFloodZone?.name ? "Basin Index Match" : "Manual Plot"}</Text>
              </View>
            </View>
          </View>

          {/* Card 2: Terrain Aspect */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardHeaderText}>TERRAIN ASPECT & TOPOLOGICAL MATH</Text>
            </View>
            <View style={styles.cardBody}>
              <View style={styles.cardRow}>
                <Text style={styles.cardLabel}>Point Elevation:</Text>
                <Text style={styles.cardValue}>{stats.elevationProfile.pointElevation.toFixed(1)} m (MSL)</Text>
              </View>
              <View style={styles.cardRow}>
                <Text style={styles.cardLabel}>Average Slope Angle:</Text>
                <Text style={styles.cardValue}>{stats.elevationProfile.slope.toFixed(2)}° ({stats.elevationProfile.slopePercent.toFixed(1)}%)</Text>
              </View>
              <View style={styles.cardRow}>
                <Text style={styles.cardLabel}>Flow Aspect Angle:</Text>
                <Text style={styles.cardValue}>{stats.elevationProfile.aspect.toFixed(1)}° ({stats.elevationProfile.aspectDirection})</Text>
              </View>
              <View style={styles.cardRow}>
                <Text style={styles.cardLabel}>Catchment Mean Elev:</Text>
                <Text style={styles.cardValue}>{stats.elevationProfile.meanElevation.toFixed(1)} m</Text>
              </View>
              <View style={[styles.cardRow, { borderBottomWidth: 0 }]}>
                <Text style={styles.cardLabel}>Zonal Elevation Range:</Text>
                <Text style={styles.cardValue}>{stats.elevationProfile.minElevation}m – {stats.elevationProfile.maxElevation}m</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Spatial Exposure Matrix Section */}
        <Text style={styles.sectionTitle}>SENSITIVE ASSETS & POPULATION EXPOSURE MATRIX (BUFFER PROFILE)</Text>
        <Text style={styles.sectionSub}>
          Calculated utilizing WorldPop Spatial Estimator overlay inside a customized {stats.bufferRadiusKm} km vulnerability radius:
        </Text>

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCol, { width: tableColWidths.col1 }]}>EXPOSED DOMAIN STATISTIC</Text>
            <Text style={[styles.tableHeaderCol, { width: tableColWidths.col2 }]}>COMPUTED METRIC</Text>
            <Text style={[styles.tableHeaderCol, { width: tableColWidths.col3 }]}>SCENARIO MULTIPLIER</Text>
            <Text style={[styles.tableHeaderCol, { width: tableColWidths.col4 }]}>SEVERITY LEVEL</Text>
          </View>

          {rows.map((row, index) => {
            const isZebra = index % 2 === 1;
            const isAlert = row.sev.includes("CRITICAL") || row.sev.includes("HIGH") || row.sev.includes("SEVERE");
            return (
              <View key={index} style={isZebra ? styles.tableRowZebra : styles.tableRow}>
                <Text style={[styles.tableCellBold, { width: tableColWidths.col1 }]}>{row.metric}</Text>
                <Text style={[styles.tableCell, { width: tableColWidths.col2 }]}>{row.val}</Text>
                <Text style={[styles.tableCell, { width: tableColWidths.col3 }]}>{row.coeff}</Text>
                <Text style={[
                  styles.tableCellBold, 
                  { 
                    width: tableColWidths.col4, 
                    color: isAlert ? "#dc2626" : "#64748b" 
                  }
                ]}>
                  {row.sev}
                </Text>
              </View>
            );
          })}
        </View>

        {/* Key Risk Factors */}
        <Text style={styles.sectionTitle}>IDENTIFIED TOPOGRAPHIC & CLIMATE VULNERABILITY CONSTRAINTS</Text>
        <View style={styles.factorsContainer}>
          {stats.riskFactors && stats.riskFactors.length > 0 ? (
            stats.riskFactors.map((factor, index) => (
              <View key={index} style={styles.factorItem}>
                <View style={[styles.factorDot, { backgroundColor: currentSeverityColor }]} />
                <Text style={styles.factorLabel}>Vulnerability Index {index + 1}:</Text>
                <Text style={styles.factorText}>{factor}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.factorText}>No critical elevation or localized proximity vulnerabilities computed for the coordinates.</Text>
          )}
        </View>

        <PageFooter />
      </Page>

      {/* PAGE 2: ARTIFICIAL INTELLIGENCE RISK ASSESSMENT & REASONING */}
      <Page size="A4" style={styles.page}>
        <PageHeader />
        
        <Text style={styles.sectionTitle}>GENERATIVE ARTIFICIAL INTELLIGENCE RISK ASSESSMENT & HYDROLOGY SYNOPSIS</Text>
        <Text style={styles.sectionSub}>
          Dynamic real-time LLM Synthesis matching zonal constraints, geomorphology thresholds, and elevation variations:
        </Text>

        {aiData ? (
          <View>
            {/* Executive Summary Card */}
            <View style={styles.aiSummaryBanner}>
              <Text style={styles.aiSummaryHeader}>EXECUTIVE ADVISORY SYNTHESIS</Text>
              <Text style={styles.aiSummaryText}>{aiData.summary}</Text>
            </View>

            {/* Scientific Geomorphic Reasoning */}
            <Text style={[styles.sectionTitle, { marginTop: 8 }]}>GEOMORPHIC & HYDROLOGICAL CRITERIA OVERVIEW</Text>
            <Text style={styles.aiParagraph}>{aiData.reasoning}</Text>

            {/* Recommendations */}
            <Text style={[styles.sectionTitle, { marginTop: 6, marginBottom: 8 }]}>NADMO CIVIL SAFETY RECOMMENDED MITIGATION ROADMAP</Text>
            <View>
              {aiData.recommendations && aiData.recommendations.length > 0 ? (
                aiData.recommendations.map((rec, index) => (
                  <View key={index} style={styles.recRow}>
                    <View style={styles.recBadge}>
                      <Text style={styles.recBadgeText}>{index + 1}</Text>
                    </View>
                    <Text style={styles.recText}>{rec}</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.aiParagraph}>No specific localized civil protection actions compiled.</Text>
              )}
            </View>
          </View>
        ) : (
          <Text style={styles.aiParagraph}>
            Structured Generative AI risk assessment was not compiled in the active session. Please execute standard regional baseline protocols.
          </Text>
        )}

        <PageFooter />
      </Page>

      {/* PAGE 3: SAFE HAVENS & EMERGENCY DESK DIRECTORY */}
      <Page size="A4" style={styles.page}>
        <PageHeader />

        <Text style={styles.sectionTitle}>CIVIL RETREAT DIRECTIONS: NEAREST DESIGNATED SAFE HAVENS</Text>
        <Text style={styles.sectionSub}>
          Geodesically computed using high-accuracy Haversine formulas against the registered NADMO Certified Sanctuary Database:
        </Text>

        {/* Render Top Safe Havens (up to 3) */}
        {stats.safeHavens && stats.safeHavens.length > 0 ? (
          stats.safeHavens.slice(0, 3).map((haven, idx) => {
            const isNearest = idx === 0;
            return (
              <View key={idx} style={isNearest ? [styles.havenCard, styles.havenCardPrimary] : styles.havenCard}>
                <View style={styles.havenHeaderRow}>
                  <Text style={styles.havenTitle}>🏟️ Sanctuary {idx + 1}: {haven.name}</Text>
                  {isNearest ? (
                    <View style={styles.havenBadge}>
                      <Text style={styles.havenBadgeText}>NEAREST RECOMMENDED</Text>
                    </View>
                  ) : null}
                </View>

                <View style={styles.havenBodyGrid}>
                  <View style={styles.havenBodyCol}>
                    <Text style={styles.havenLabel}>Facility Class:</Text>
                    <Text style={styles.havenValue}>{haven.type}</Text>
                  </View>
                  <View style={styles.havenBodyCol}>
                    <Text style={styles.havenLabel}>Geodesic Distance:</Text>
                    <Text style={styles.havenDistance}>{haven.distanceKm.toFixed(2)} km</Text>
                  </View>
                  <View style={styles.havenBodyCol}>
                    <Text style={styles.havenLabel}>Zone Capacity:</Text>
                    <Text style={styles.havenValue}>{haven.capacity.toLocaleString()} persons</Text>
                  </View>
                  <View style={styles.havenBodyCol}>
                    <Text style={styles.havenLabel}>Emergency Coordinator Desk:</Text>
                    <Text style={styles.havenValue}>{haven.contact}</Text>
                  </View>
                </View>

                {/* Evacuation directions */}
                <View style={styles.routeBox}>
                  <Text style={styles.routeLabel}>RECOMMENDED EXIT ROUTING:</Text>
                  <Text style={styles.routeValue}>{haven.evacuationRoutes.join(" ➔ ")}</Text>
                </View>
              </View>
            );
          })
        ) : (
          <Text style={styles.aiParagraph}>No safe haven sanctuaries linked to this target matrix.</Text>
        )}

        {/* Emergency Dispatch Desk Table */}
        <Text style={[styles.sectionTitle, { marginTop: 12 }]}>NATIONAL DISASTER CONTROL & EMERGENCY HOTLINE NETWORK</Text>
        <View style={[styles.table, { marginTop: 4 }]}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCol, { width: hotlineColWidths.service }]}>EMERGENCY SERVICE STATION</Text>
            <Text style={[styles.tableHeaderCol, { width: hotlineColWidths.shortcode }]}>TOLL-FREE SHORTCODES</Text>
            <Text style={[styles.tableHeaderCol, { width: hotlineColWidths.dispatch }]}>DIRECT DISPATCH DESK</Text>
          </View>

          {hotlines.map((line, index) => {
            const isZebra = index % 2 === 1;
            return (
              <View key={index} style={isZebra ? styles.tableRowZebra : styles.tableRow}>
                <Text style={[styles.tableCellBold, { width: hotlineColWidths.service }]}>{line.service}</Text>
                <Text style={[styles.tableCellBold, { width: hotlineColWidths.shortcode, color: "#4f46e5" }]}>{line.short}</Text>
                <Text style={[styles.tableCell, { width: hotlineColWidths.dispatch }]}>{line.direct}</Text>
              </View>
            );
          })}
        </View>

        <PageFooter />
      </Page>

    </Document>
  );
};

/**
 * Triggers the client-side download sequence for the `@react-pdf/renderer` compiled document.
 */
export async function generateDisasterBulletinPdf(
  stats: GeospatialStats,
  aiData: RiskAnalysisAiResponse | null
): Promise<void> {
  try {
    const doc = <NADMO_DisasterBulletinDocument stats={stats} aiData={aiData} />;
    
    // Compile document to standard Blob
    const blob = await pdf(doc).toBlob();
    const url = URL.createObjectURL(blob);
    
    // Sanitize filename safe for standard Operating Systems
    const safeFilename = `${stats.nearestFloodZone?.name || "Ghana"}_Disaster_Bulletin_${stats.latitude.toFixed(4)}_${stats.longitude.toFixed(4)}.pdf`
      .replace(/\s+/g, "_")
      .replace(/[()]/g, "");

    // Direct DOM download action (bypasses popups safely)
    const link = document.createElement("a");
    link.href = url;
    link.download = safeFilename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Release memory allocation
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Failed to generate and download React-PDF Bulletin:", error);
  }
}
