// telemetry.ts
import {
    NodeSdk,
    OtlpLogger,
    OtlpSerialization,
} from "@effect/opentelemetry"
import { FetchHttpClient } from "@effect/platform"
import { OTLPMetricExporter } from "@opentelemetry/exporter-metrics-otlp-http"
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http"
import { PeriodicExportingMetricReader } from "@opentelemetry/sdk-metrics"
import { BatchSpanProcessor } from "@opentelemetry/sdk-trace-base"
import { Layer } from "effect"

const URL = "http://localhost:4318"
const headers = { authorization: process.env.HYPERDX_API_KEY! }

const SdkLive = NodeSdk.layer(() => ({
    resource: { serviceName: "test" },
    spanProcessor: new BatchSpanProcessor(
        new OTLPTraceExporter({ url: `${URL}/v1/traces`, headers }),
    ),
    metricReader: new PeriodicExportingMetricReader({
        exporter: new OTLPMetricExporter({ url: `${URL}/v1/metrics`, headers }),
        exportIntervalMillis: 30_000,
    }),
}))

const LoggerLive = OtlpLogger.layer({
    url: `${URL}/v1/logs`,
    headers,
    resource: { serviceName: "test" },
}).pipe(
    Layer.provide(OtlpSerialization.layerJson),
    Layer.provide(FetchHttpClient.layer),
)

export const TelemetryLive = Layer.mergeAll(SdkLive, LoggerLive)