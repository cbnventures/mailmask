import type { Lib_Schema_ConfigSchema } from '../../../lib/schema.d.ts';

/**
 * Tests - CLI - Commands - Generate.
 *
 * @since 0.0.1
 */
export type Tests_Cli_Commands_Generate_OutputDir = string;

export type Tests_Cli_Commands_Generate_SampleConfigPath = string;

/**
 * Tests - CLI - Commands - Generate - Generate Wrangler Toml - Points Main At The Bundled Entry And Disables Public Urls.
 *
 * @since 1.0.0
 */
export type Tests_Cli_Commands_Generate_GenerateWranglerToml_PointsMainAtTheBundledEntryAndDisablesPublicUrls_OutputPath = string;

export type Tests_Cli_Commands_Generate_GenerateWranglerToml_PointsMainAtTheBundledEntryAndDisablesPublicUrls_Toml = string;

/**
 * Tests - CLI - Commands - Generate - Generate Wrangler Toml - Resolves The Worker Import From A Symlinked Config Folder.
 *
 * @since 1.0.0
 */
export type Tests_Cli_Commands_Generate_GenerateWranglerToml_ResolvesTheWorkerImportFromASymlinkedConfigFolder_RealDir = string;

export type Tests_Cli_Commands_Generate_GenerateWranglerToml_ResolvesTheWorkerImportFromASymlinkedConfigFolder_LinkedDir = string;

export type Tests_Cli_Commands_Generate_GenerateWranglerToml_ResolvesTheWorkerImportFromASymlinkedConfigFolder_BundleDir = string;

export type Tests_Cli_Commands_Generate_GenerateWranglerToml_ResolvesTheWorkerImportFromASymlinkedConfigFolder_EntryLines = string[];

export type Tests_Cli_Commands_Generate_GenerateWranglerToml_ResolvesTheWorkerImportFromASymlinkedConfigFolder_ImportPath = string;

/**
 * Tests - CLI - Commands - Generate - Generate Wrangler Toml - Writes Next To The Config File By Default.
 *
 * @since 1.0.0
 */
export type Tests_Cli_Commands_Generate_GenerateWranglerToml_WritesNextToTheConfigFileByDefault_ConfigPath = string;

/**
 * Tests - CLI - Commands - Generate - Generate Wrangler Toml - Writes The Config And An Entry That Imports The Worker.
 *
 * @since 1.0.0
 */
export type Tests_Cli_Commands_Generate_GenerateWranglerToml_WritesTheConfigAndAnEntryThatImportsTheWorker_OutputPath = string;

export type Tests_Cli_Commands_Generate_GenerateWranglerToml_WritesTheConfigAndAnEntryThatImportsTheWorker_BundleDir = string;

export type Tests_Cli_Commands_Generate_GenerateWranglerToml_WritesTheConfigAndAnEntryThatImportsTheWorker_BundledConfig = unknown;

export type Tests_Cli_Commands_Generate_GenerateWranglerToml_WritesTheConfigAndAnEntryThatImportsTheWorker_ExpectedConfig = { [Key in keyof Lib_Schema_ConfigSchema]: Lib_Schema_ConfigSchema[Key] };

export type Tests_Cli_Commands_Generate_GenerateWranglerToml_WritesTheConfigAndAnEntryThatImportsTheWorker_Entry = string;

export type Tests_Cli_Commands_Generate_GenerateWranglerToml_WritesTheConfigAndAnEntryThatImportsTheWorker_WorkerPath = string;

export type Tests_Cli_Commands_Generate_GenerateWranglerToml_WritesTheConfigAndAnEntryThatImportsTheWorker_ExpectedImport = string;
