import { beforeAll } from "vitest"
import { setProjectAnnotations } from "@storybook/web-components"
import * as projectAnnotations from "./preview"

const project = setProjectAnnotations([projectAnnotations])

beforeAll(project.beforeAll)
