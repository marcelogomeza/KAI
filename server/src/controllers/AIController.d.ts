export declare class AIController {
    private openaiApiKey;
    private anthropicApiKey;
    constructor();
    queryOpenAI(prompt: string): Promise<string>;
    queryAnthropic(prompt: string): Promise<string>;
}
//# sourceMappingURL=AIController.d.ts.map