import { expect, type Page } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { randomInt } from 'crypto';

export class fileMethods{
    readonly page: Page;
    file_path: string;
    file_name: string;

    constructor(page: Page){
        this.page = page;
        this.file_path = 'test_data/';
    }

    async download_pdf_file(pdfUrl){
        this.file_name = `test_stmt_${randomInt(0,999)}.pdf`
        const pdfBuffer = await this.page.evaluate(async (blobUrl) => {
            const response = await fetch(blobUrl);
            const blob = await response.blob();
            return new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result as string);
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            });
        }, pdfUrl);
        const base64Data = pdfBuffer.split(',')[1];
        const buffer = Buffer.from(base64Data, 'base64');
        const downloadPath = path.join(this.file_path, this.file_name);
        fs.writeFileSync(downloadPath, buffer);
    }

    async delete_downloaded_file(){
        fs.unlink(`${this.file_path}${this.file_name}`, function(){console.log('done')});
    }

    async parse_pdf(){
        var pdf = require('pdf-parse');
        var dataBuffer = fs.readFileSync(`${this.file_path}${this.file_name}`);
        var response_text;
        await pdf(dataBuffer).then(function(data){
            response_text =  data.text;
        });
        return response_text;
    }

    async generate_expected_text(){//(issuer, issue, username, address, from_date, to_date, account_num, restricted_quantity, unrestricted_quantity){
        var header = `\n\nStatement\nVinyl Equity, Inc.\nPO Box 247, Winnetka, IL, 60093, USA\nhttps://www.vinylequity.com\nLPA Number: 7925\n${process.env.ISSUER1} ${process.env.ISSUE1}\n`;
        var ro_details1 = `${process.env.RO2_USERNAME}\n${process.env.RO2_ADDRESS}\n`
        var ticker = "Ticker: \nCUSIP: 779810131101\n";
        var date_range = "2025-01-24 to 2025-01-24\n";
        var ro_details2 = `Registered Owner: ${process.env.RO2_USERNAME}\nDRS Account Number: ${process.env.RO2_ACCOUNT_NUM}\n`;
        var holding_summary_header = "Holdings Summary\nUnrestricted QuantityRestricted QuantityTotal Quantity\n";
        var holding_summary_body = "9,98609,986\n"
        var holding_details_header = "Holdings Detail\nIssue DateQuantityAcquisition DateCost BasisGift/InheritedGift FMVLegend Code(s)Expiry Date\n"
        var holding_details_body = "2025-01-029,9862025-01-23\n$109,846.00\n";
        var transaction_header = "Transactions\nDateDescriptionQuantity IssuedQuantity CanceledRestrictionsExpiry Date\n";
        var transaction_body = "2025-01-24Transfer - Move to Broker \n(DWAC Deposit)\n01\n2025-01-24Transfer - Move to Broker \n(DWAC Deposit)\n01\n2025-01-24Transfer - Move to Broker \n(DWAC Deposit)\n01\n2025-01-24Transfer - Move to Broker \n(DWAC Deposit)\n01\n2025-01-24Transfer - Move to Broker \n(DWAC Deposit)\n01\n2025-01-24Transfer - Move to Broker \n(DWAC Deposit)\n01\n2025-01-24Transfer - Move to Broker \n(DWAC Deposit)\n01\n"
        var legend_header = "Legend Details\nLegend CodeLegend Text\n"
        var legend_body = "\n"
        var legend_footer = "Legends are restrictions on the transfer of securities. If the Legend has an expiry date, it will automatically fall off on that date. If the legend is related \nto the 1933 Act or Rule 144, there is a hold period and other requirements for removal. Please log into your account for more information.\n";
        var footer = "As the registered owner or a legal representative thereof, you may access your account securely 24 x 7 at the website provided above. Vinyl Equity, \nInc. is an SEC registered Transfer Agent & Registrar. If you wish to learn more about our Privacy and Data Protection Policies, please visit our website \nat the link above.";
        var ro_details =  ro_details1 + ticker + date_range + ro_details2;
        var holding_summary = holding_summary_header + holding_summary_body;
        var holding_details = holding_details_header + holding_details_body;
        var transaction = transaction_header + transaction_body;
        var legend = legend_header + legend_body + legend_footer;
        var expected_text = header + ro_details + holding_summary + holding_details + transaction + legend + footer;
        return expected_text;
    }
}