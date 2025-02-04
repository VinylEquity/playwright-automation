import { type Page } from '@playwright/test';
import { signInPage } from './signInPage';
import { phoneVerificationPage } from './phoneVerificationPage';
import { dashboardPage } from './dashBoardPage';
import { treasuryOrderPage } from './treasuryOrderPage';
import { portfolioPage} from './portfolioPage';
import { returnToTreasuryPage } from './returnToTreasuryPage';
import { transfersPage } from './transfersPage';
import { holderManagementPage } from './holderManagementPage';
import { transfersPageRO } from './transfersPageRO';

export class vinylPages{
    readonly page: Page;
    readonly SignInPage;
    readonly DashboardPage;
    readonly TreasuryOrderPage;
    readonly PhoneVerificationPage;
    readonly PortfolioPage;
    readonly ReturnToTreasuryPage;
    readonly TransfersPage;
    readonly HolderManagementPage;
    readonly TransfersPageRO;

    constructor(page: Page){
        this.SignInPage = new signInPage(page);
        this.PhoneVerificationPage = new phoneVerificationPage(page);
        this.DashboardPage = new dashboardPage(page);
        this.TreasuryOrderPage =  new treasuryOrderPage(page);
        this.PortfolioPage = new portfolioPage(page);
        this.ReturnToTreasuryPage = new returnToTreasuryPage(page);
        this.TransfersPage = new transfersPage(page);
        this.HolderManagementPage =  new holderManagementPage(page);
        this.TransfersPageRO =  new transfersPageRO(page);
    }
}