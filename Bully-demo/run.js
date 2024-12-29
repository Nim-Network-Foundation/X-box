const { DatasetConfig, TweetDatasetProcessor } = require('./tweet_dataset_processor');

// Dataset processor configuration
const config = new DatasetConfig({
    // Brand identity
    tickerSymbol: '<YOUR_TICKER_SYMBOL>', // e.g. 'XENO'
    twitterHandle: '<YOUR_TWITTER_HANDLE>', // e.g. 'Xenopus_v1'
    
    // Data paths
    inputMainTweetsPath: '../data/raw-data/bully/Bully_full.json',
    inputPairsPath: '../data/raw-data/bully/bully_pairs_5000.json',
    outputPath: 'datasets',
    
    // System prompts
    systemPrompts: {
        mainTweets: "You're Xenobot a funny AI agent that control a twitter account under the username {twitterHandle}, roast and make fun of people, make sure you're funny and unhinged.",
        replies: "You're Xenobot a funny AI agent that control a twitter account under the username {twitterHandle}, roast and make fun of people tagging you on X/twitter, make sure you're funny and unhinged."
    }
});

// Run the processor
const processor = new TweetDatasetProcessor(config);
processor.process().catch(error => {
    console.error('Error:', error);
    process.exit(1);
}); 