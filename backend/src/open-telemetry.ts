// Import required symbols
const { Resource } = require("@opentelemetry/resources");
import {
  SimpleSpanProcessor,
  BatchSpanProcessor,
  ConsoleSpanExporter,
} from "@opentelemetry/sdk-trace-base";
const { NodeTracerProvider } = require("@opentelemetry/sdk-trace-node");
const { registerInstrumentations } = require("@opentelemetry/instrumentation");
const { HttpInstrumentation } = require("@opentelemetry/instrumentation-http");
import { GrpcInstrumentation } from "@opentelemetry/instrumentation-grpc";
import { JsonRpc2Instrumentation } from "opentelemetry-instrumentation-jsonrpc";
const {
  ExpressInstrumentation,
} = require("@opentelemetry/instrumentation-express");
// **DELETE IF SETTING UP A GATEWAY, UNCOMMENT OTHERWISE**
const {
  GraphQLInstrumentation,
} = require("@opentelemetry/instrumentation-graphql");
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";

// Register server-related instrumentation
registerInstrumentations({
  instrumentations: [
    new HttpInstrumentation(),
    new ExpressInstrumentation(),
    new GraphQLInstrumentation(),
    new GrpcInstrumentation(),
    new JsonRpc2Instrumentation(),
  ],
});

// Initialize provider and identify this particular service
// (in this case, we're implementing a federated gateway)
const provider = new NodeTracerProvider({
  resource: Resource.default().merge(
    new Resource({
      // Replace with any string to identify this service in your system
      "service.name": "bff",
    })
  ),
});

// Configure a test exporter to print all traces to the console
// const consoleExporter = new ConsoleSpanExporter();
// provider.addSpanProcessor(new SimpleSpanProcessor(consoleExporter));
provider.addSpanProcessor(
  new BatchSpanProcessor(
    new OTLPTraceExporter({
      url: "http://localhost:4318/v1/traces",
    }),
    {
      maxQueueSize: 1000,
      scheduledDelayMillis: 1000,
    }
  )
);

// Register the provider to begin tracing
provider.register();
