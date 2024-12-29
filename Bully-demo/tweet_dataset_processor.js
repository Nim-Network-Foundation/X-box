const fs = require('fs').promises;
const path = require('path');

/**
 * @typedef {Object} SystemPrompts
 * @property {string} mainTweets - System prompt for main tweets
 * @property {string} replies - System prompt for reply tweets
 */

/**
 * @typedef {Object} ProcessorConfig
 * @property {string} tickerSymbol - The ticker symbol to use (e.g., 'XENO')
 * @property {string} twitterHandle - The Twitter handle to use
 * @property {string} inputMainTweetsPath - Path to main tweets JSON file
 * @property {string} inputPairsPath - Path to tweet pairs JSON file
 * @property {string} outputPath - Path for output files
 * @property {SystemPrompts} systemPrompts - Custom system prompts
 */

/**
 * Configuration manager for the tweet dataset processor
 * @class
 */
class DatasetConfig {
    /**
     * Creates a new dataset configuration
     * @param {ProcessorConfig} config - Configuration options
     */
    constructor({
        tickerSymbol,
        twitterHandle,
        inputMainTweetsPath,
        inputPairsPath,
        outputPath,
        systemPrompts = {}
    }) {
        // Validate required parameters
        if (!tickerSymbol || !twitterHandle) {
            throw new Error('tickerSymbol and twitterHandle are required parameters');
        }

        this.tickerSymbol = tickerSymbol.toUpperCase();
        this.twitterHandle = twitterHandle;
        
        // Resolve paths relative to the Bully-demo directory
        this.inputMainTweetsPath = path.resolve(__dirname, inputMainTweetsPath || '../data/raw-data/bully/Bully_full.json');
        this.inputPairsPath = path.resolve(__dirname, inputPairsPath || '../data/raw-data/bully/bully_pairs_5000.json');
        this.outputPath = path.resolve(__dirname, outputPath || './datasets');

        // Initialize system prompts with defaults AND replace placeholders
        const processedPrompts = {
            mainTweets: systemPrompts.mainTweets || "You're ${tickerSymbol} a funny AI agent that control a twitter account under the username {twitterHandle}, roast and make fun of people, make sure you're funny and unhinged.",
            replies: systemPrompts.replies || "You're ${tickerSymbol} a funny AI agent that control a twitter account under the username {twitterHandle}, roast and make fun of people tagging you on X/twitter, make sure you're funny and unhinged."
        };

        // Replace all placeholders
        this.systemPrompts = {
            mainTweets: processedPrompts.mainTweets
                .replace(/\${tickerSymbol}/g, this.tickerSymbol)
                .replace(/{twitterHandle}/g, this.twitterHandle),
            replies: processedPrompts.replies
                .replace(/\${tickerSymbol}/g, this.tickerSymbol)
                .replace(/{twitterHandle}/g, this.twitterHandle)
        };
    }

    /**
     * Gets the full path for a specific output file type
     * @param {'main'|'pairs'|'combined'} type - The type of output file
     * @returns {string} Full path to the output file
     */
    getOutputFilePath(type) {
        const fileNames = {
            'main': 'main_tweets_dataset.jsonl',
            'pairs': 'replies_dataset.jsonl',
            'combined': 'final_dataset.jsonl'
        };

        if (!fileNames[type]) {
            throw new Error(`Invalid output type: ${type}`);
        }

        return path.join(this.outputPath, fileNames[type]);
    }
}

/**
 * Text cleaning utility class
 */
class TextCleaner {
    constructor(config) {
        this.config = config;
        this.mentionRegex = /@\w+/g;
        this.tickerRegex = /\$(?:BULLY|XENO)/gi;
        this.oldHandleRegex = /@dolos_diary/gi;
    }

    /**
     * Cleans tweet text by removing mentions and standardizing branding
     * @param {string} text - The tweet text to clean
     * @param {boolean} keepMentions - Whether to preserve @mentions
     * @returns {string} - Cleaned tweet text
     */
    clean(text, keepMentions = false) {
        let cleanedText = text;

        // Handle mentions
        if (!keepMentions) {
            cleanedText = cleanedText.replace(this.mentionRegex, '');
        }

        // Replace ticker symbols
        cleanedText = cleanedText.replace(this.tickerRegex, `$${this.config.tickerSymbol}`);

        // Replace Twitter handle
        cleanedText = cleanedText.replace(this.oldHandleRegex, `@${this.config.twitterHandle}`);

        // Clean up whitespace
        return cleanedText.replace(/\s+/g, ' ').trim();
    }
}

/**
 * Main dataset processor class
 */
class TweetDatasetProcessor {
    constructor(config) {
        this.config = config;
        this.cleaner = new TextCleaner(config);
    }

    /**
     * Validates a potential dataset entry
     * @param {string} userContent - The user/original tweet content
     * @param {string} assistantContent - The assistant/reply content
     * @returns {boolean} - Whether the entry is valid
     */
    validateEntry(userContent, assistantContent) {
        // Check for empty or whitespace-only content
        if (!userContent?.trim() || !assistantContent?.trim()) {
            return false;
        }

        // Check for minimum content length (e.g., at least 2 characters)
        if (userContent.trim().length < 2 || assistantContent.trim().length < 2) {
            return false;
        }

        return true;
    }

    /**
     * Creates a JSONL entry with validation
     */
    createJSONLEntry(systemPrompt, userContent, assistantContent) {
        // Validate content before creating entry
        if (!this.validateEntry(userContent, assistantContent)) {
            return null;
        }

        return {
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userContent },
                { role: "assistant", content: assistantContent }
            ]
        };
    }

    /**
     * Processes main tweets (non-reply tweets)
     */
    async processMainTweets() {
        console.log('Processing main tweets...');
        const data = await fs.readFile(this.config.inputMainTweetsPath, 'utf8');
        const tweets = JSON.parse(data);

        let jsonlContent = '';
        const mainTweets = tweets.filter(tweet => !tweet.isReply);

        for (const tweet of mainTweets) {
            const cleanedText = this.cleaner.clean(tweet.text);
            const entry = this.createJSONLEntry(
                this.config.systemPrompts.mainTweets,
                "Write a funny tweet which includes roasting",
                cleanedText
            );
            jsonlContent += JSON.stringify(entry) + '\n';
        }

        await fs.writeFile(this.config.getOutputFilePath('main'), jsonlContent);
        console.log(`Processed ${mainTweets.length} main tweets`);
    }

    /**
     * Processes tweet pairs (original tweet + reply)
     */
    async processPairs() {
        console.log('Processing tweet pairs...');
        const data = await fs.readFile(this.config.inputPairsPath, 'utf8');
        const pairs = JSON.parse(data);

        let jsonlContent = '';
        let validPairs = 0;
        let skippedPairs = 0;

        for (const pair of pairs) {
            if (pair.original_tweet.text === "Tweet not available") {
                skippedPairs++;
                continue;
            }

            const cleanedOriginal = this.cleaner.clean(pair.original_tweet.text, true);
            const cleanedReply = this.cleaner.clean(pair.reply_tweet.text);

            const entry = this.createJSONLEntry(
                this.config.systemPrompts.replies,
                cleanedOriginal,
                cleanedReply
            );

            // Only add valid entries
            if (entry) {
                jsonlContent += JSON.stringify(entry) + '\n';
                validPairs++;
            } else {
                skippedPairs++;
            }
        }

        await fs.writeFile(this.config.getOutputFilePath('pairs'), jsonlContent);
        console.log(`Processed ${validPairs} valid tweet pairs (skipped ${skippedPairs} invalid pairs)`);
    }

    /**
     * Combines main tweets and pairs datasets into a final dataset
     */
    async combineDatesets() {
        console.log('Creating combined dataset...');
        
        const mainPath = this.config.getOutputFilePath('main');
        const pairsPath = this.config.getOutputFilePath('pairs');
        const finalPath = this.config.getOutputFilePath('combined');

        const mainContent = await fs.readFile(mainPath, 'utf8');
        const pairsContent = await fs.readFile(pairsPath, 'utf8');

        // Combine both datasets
        await fs.writeFile(finalPath, mainContent + pairsContent);
        
        const totalEntries = mainContent.split('\n').filter(Boolean).length + 
                            pairsContent.split('\n').filter(Boolean).length;
        
        console.log(`Combined dataset created with ${totalEntries} total entries`);
    }

    /**
     * Main processing function
     */
    async process() {
        try {
            // Ensure output directory exists
            await fs.mkdir(this.config.outputPath, { recursive: true });

            // Process both types of datasets
            await this.processMainTweets();
            await this.processPairs();
            await this.combineDatesets();

            console.log('Processing completed successfully!');
            console.log(`Output files can be found in: ${this.config.outputPath}`);
            console.log('Generated files:');
            console.log(`- ${this.config.getOutputFilePath('main')}`);
            console.log(`- ${this.config.getOutputFilePath('pairs')}`);
            console.log(`- ${this.config.getOutputFilePath('combined')}`);
        } catch (error) {
            console.error('Error during processing:', error);
            throw error;
        }
    }
}

// Example usage
async function main() {
    const config = new DatasetConfig({
        tickerSymbol: 'XENO',
        twitterHandle: 'Xenopus_v1',
        outputPath: 'processed_datasets'
    });

    const processor = new TweetDatasetProcessor(config);
    await processor.process();
}

// Run if called directly
if (require.main === module) {
    main().catch(console.error);
}

module.exports = {
    DatasetConfig,
    TweetDatasetProcessor
}; 