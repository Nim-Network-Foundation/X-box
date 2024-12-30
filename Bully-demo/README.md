# 🤖 Create Your Own Customized Crypto-Bully AI Agent

Transform the [@dolos_diary](https://x.com/dolos_diary) style into your own branded AI personality! This toolkit helps you create custom training data for your very own unhinged crypto-bully bot. 


## 🎯 What You'll Create

Create an AI that masters the art of crypto-focused roasts with:
- 🔥 Savage comebacks
- 💫 Unhinged personality
- 🎭 Your unique branding
- 📈 Crypto context

This is Step 1 of a 2-step process to create your own AI crypto personality:

### Step 1: Dataset Creation (This Repository)
- Transform the [@dolos_diary](https://x.com/dolos_diary) Twitter dataset
- Clean and format the data
- Replace branding with your own
- Generate SFT training files

### Step 2: Model Training
- Use the generated dataset in our [Training Notebook](https://colab.research.google.com/drive/1l1bt_YAQj5fo2eRfx5QGgdR8F70W7JzM?usp=sharing)
- Fine-tune your AI model
- Create your own Xenobot Bully agent


## 🎓 What is SFT?

Supervised Fine-Tuning (SFT) is a technique that teaches large language models to follow specific formats and styles through examples. Think of it as showing your AI "this is how we want you to respond" through thousands of demonstrations. By fine-tuning on the Bully dataset, your model learns the art of crypto-focused roasting while maintaining your unique branding. The JSONL format we create contains these examples as conversation pairs, teaching your AI both what to say and how to say it.

## 🛠️ Prerequisites

1. **Node.js**: Version 14+ required
   ```bash
   # Check your Node version
   node --version
   
   # If you need to install Node.js:
   # Visit https://nodejs.org/
   ```

2. **Training Notebook**: You'll use this data with our [SFT Training Notebook](https://colab.research.google.com/drive/1l1bt_YAQj5fo2eRfx5QGgdR8F70W7JzM?usp=sharing)

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/Nim-Network-Foundation/X-box
   cd X-box
   cd Bully-demo

   ```

2. **Configure Your Brand** 
   Edit `run.js` with your details:
   ```javascript
   const { DatasetConfig, TweetDatasetProcessor } = require('./tweet_dataset_processor');

   const config = new DatasetConfig({
       // 🎨 YOUR BRAND IDENTITY HERE
       tickerSymbol: '<YOUR_TICKER_SYMBOL>',           // Your token symbol
       twitterHandle: '<YOUR_TWITTER_HANDLE>',  // Your Twitter handle (no @)
       
       // 📁 Data paths (usually leave as default)
       inputMainTweetsPath: '../data/raw-data/bully/Bully_full.json',
       inputPairsPath: '../data/raw-data/bully/bully_pairs_5000.json',
       outputPath: 'datasets',
       
       // 🎯 Customize agent personality
       systemPrompts: {
           mainTweets: "You're Xenobot a funny AI agent that control a twitter account under the username {twitterHandle}, roast and make fun of people, make sure you're funny and unhinged.",
           replies: "You're Xenobot a funny AI agent that control a twitter account under the username {twitterHandle}, roast and make fun of people tagging you on X/twitter, make sure you're funny and unhinged."
       }
   });

   // 🚀 Run the processor
   const processor = new TweetDatasetProcessor(config);
   processor.process().catch(error => {
       console.error('Error:', error);
       process.exit(1);
   });
   ```

3. **Run the Processor**
   ```bash
   node run.js
   ```

## 📦 Output Format

Your training data will be generated in JSONL format ready for fine-tuning:

```javascript
{
    "messages": [
        {
            "role": "system",
            "content": "You're Xenobot, a funny AI agent..."
        },
        {
            "role": "user",
            "content": "Original tweet or prompt"
        },
        {
            "role": "assistant",
            "content": "Generated response"
        }
    ]
}
```

## 📚 Generated Files

The processor creates three datasets:

1. `main_tweets_dataset.jsonl` 
   - 🎯 Standalone roasts and commentary
   - Perfect for general posting ability

2. `replies_dataset.jsonl`
   - 💬 Interaction pairs (original + reply)
   - Teaches contextual roasting

3. `final_dataset.jsonl`
   - 🎓 Combined training dataset
   - Ready for the SFT notebook

## 🎓 Next Steps

1. Take your generated `final_dataset.jsonl` to the [SFT Training Notebook](https://colab.research.google.com/drive/1l1bt_YAQj5fo2eRfx5QGgdR8F70W7JzM?usp=sharing)
2. Follow the notebook instructions to train your model
3. Deploy your newly trained roast master! 🚀

## 🔍 Processing Features

- 🧹 Cleans and standardizes tweets
- 🎨 Replaces branding with yours
- ⚡ Handles both tweets and replies
- 🎭 Maintains the signature unhinged style

## ⚠️ Need Help?

- Check your Node.js version is 14+
- Verify file paths in `run.js`
- Ensure your brand details are set
- Check console for detailed error messages
