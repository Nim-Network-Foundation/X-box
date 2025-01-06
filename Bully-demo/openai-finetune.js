const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const { OpenAI } = require('openai');
const fs = require('fs');
const fsPromises = require('fs').promises;
const chalk = require('chalk');
const ora = require('ora');
const { DatasetConfig, TweetDatasetProcessor } = require('./tweet_dataset_processor');

class OpenAIFineTuner {
    constructor() {
        if (!process.env.OPENAI_API_KEY) {
            throw new Error('OPENAI_API_KEY environment variable is not set. Please check your .env file.');
        }
        
        this.openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });
    }

    async prepareDataset() {
        const spinner = ora('Preparing dataset...').start();
        try {
            // Create dataset processor configuration
            const config = new DatasetConfig({
                tickerSymbol: process.env.TICKER_SYMBOL || 'XENO',
                twitterHandle: process.env.TWITTER_HANDLE || 'Xenopus_v1',
                inputMainTweetsPath: '../data/raw-data/bully/Bully_full.json',
                inputPairsPath: '../data/raw-data/bully/bully_pairs_5000.json',
                outputPath: 'datasets'
            });

            // Run the processor
            const processor = new TweetDatasetProcessor(config);
            await processor.process();
            spinner.succeed('Dataset prepared successfully');
        } catch (error) {
            spinner.fail('Dataset preparation failed');
            throw error;
        }
    }

    async uploadFile(filepath) {
        const spinner = ora('Uploading dataset...').start();
        try {
            const file = await this.openai.files.create({
                file: fs.createReadStream(filepath),
                purpose: 'fine-tune'
            });
            spinner.succeed('Dataset uploaded successfully');
            return file.id;
        } catch (error) {
            spinner.fail('Upload failed');
            throw error;
        }
    }

    async createFineTuningJob(fileId) {
        const spinner = ora('Creating fine-tuning job...').start();
        try {
            const fineTune = await this.openai.fineTuning.jobs.create({
                training_file: fileId,
                model: process.env.MODEL_NAME || 'gpt-4o-mini-2024-07-18',
                method: {
                    type: "supervised",
                    supervised: {
                        hyperparameters: {
                            batch_size: "auto",
                            learning_rate_multiplier: "auto",
                            n_epochs: "auto"
                        }
                    }
                }
            });
            spinner.succeed('Fine-tuning job created');
            return fineTune.id;
        } catch (error) {
            spinner.fail('Job creation failed');
            throw error;
        }
    }

    async monitorProgress(jobId) {
        const spinner = ora('Monitoring fine-tuning progress...').start();
        try {
            while (true) {
                const job = await this.openai.fineTuning.jobs.retrieve(jobId);
                spinner.text = `Status: ${job.status} | Progress: ${job.trained_tokens || 0} tokens`;
                
                switch (job.status) {
                    case 'succeeded':
                        spinner.succeed('Fine-tuning completed successfully!');
                        console.log(chalk.green(`Model ID: ${job.fine_tuned_model}`));
                        return;
                    case 'failed':
                        spinner.fail('Fine-tuning failed');
                        throw new Error(job.error || 'Unknown error');
                    case 'cancelled':
                        spinner.fail('Fine-tuning job was cancelled');
                        process.exit(1);
                    default:
                        // Continue monitoring for other statuses
                        await new Promise(resolve => setTimeout(resolve, 10000));
                }
            }
        } catch (error) {
            spinner.fail('Monitoring failed');
            throw error;
        }
    }

    async run() {
        try {
            console.log(chalk.blue('Starting OpenAI Fine-tuning Process'));
            
            // First prepare the dataset
            await this.prepareDataset();
            
            // Upload dataset
            const datasetPath = path.join(__dirname, 'datasets', 'final_dataset.jsonl');
            const fileId = await this.uploadFile(datasetPath);
            
            // Create and monitor fine-tuning job
            const jobId = await this.createFineTuningJob(fileId);
            await this.monitorProgress(jobId);
            
            console.log(chalk.green('\nFine-tuning process completed successfully!'));
        } catch (error) {
            console.error(chalk.red('Error during fine-tuning:'), error);
            process.exit(1);
        }
    }
}

// Run the fine-tuning process
const fineTuner = new OpenAIFineTuner();
fineTuner.run(); 