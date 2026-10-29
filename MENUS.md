# Pakiza Accounts - Comprehensive Menu & Route Directory

Below is the complete table of all system navigation menus, sub-menu items, and associated route paths with parameters and route aliases across the Pakiza Accounts platform.

| # | Menu Group | Sub-Menu Item | Route Path & Parameter |
|---|------------|---------------|------------------------|
| 1 | Dashboard | Dashboard Overview | `/` <br>*(Aliases: `/dashboard`, `/management-dashboard`, `/user-dashboard`)* |
| 2 | Accounts Configuration & Setup > Master Configuration & Setup (F&A) | Master Configuration (F&A) | `/accounts-config/master-config` |
| 3 | Accounts Configuration & Setup > Master Configuration & Setup (F&A) | Financial Period Setup | `/accounts-config/financial-period-setup` <br>*(Alias: `/financial-period-setup`)* |
| 4 | Accounts Configuration & Setup > Master Configuration & Setup (F&A) | Chart of Accounts | `/accounts-config/chart-of-accounts` <br>*(Direct: `/chart-of-accounts`)* <br>• View Tree: `/chart-of-accounts/tree` <br>• Create Account: `/chart-of-accounts/new` <br>• Edit Account: `/chart-of-accounts/:id/edit` |
| 5 | Accounts Configuration & Setup > Master Configuration & Setup (F&A) | Opening Balance | `/accounts-config/opening-balance` <br>*(Alias: `/opening-balance`)* |
| 6 | Accounts Configuration & Setup > Master Configuration & Setup (F&A) | Voucher Setup | `/accounts-config/voucher-setup` <br>*(Direct: `/vouchers`)* <br>• Create Setup: `/vouchers/new` <br>• Configure Voucher: `/vouchers/:id/setup` <br>• Journal Voucher Entry: `/vouchers/entry/journal` <br>• Payment Voucher Entry: `/vouchers/entry/payment` <br>• Receive Voucher Entry: `/vouchers/entry/receive` <br>• Contra Voucher Entry: `/vouchers/entry/contra` <br>• Dynamic Type Entry: `/vouchers/entry/:type` |
| 7 | Accounts Configuration & Setup > Master Configuration & Setup (F&A) | Currency Setup | `/accounts-config/currency-setup` <br>*(Direct: `/currency-setup`)* <br>• Rate List: `/currency-setup/rates` <br>• Add Currency: `/currency-setup/new` <br>• Edit Currency: `/currency-setup/:id/edit` |
| 8 | Accounts Configuration & Setup > Master Configuration & Setup (F&A) | Subledger | `/accounts-config/subledger` <br>*(Direct: `/subledger`)* <br>• Add Subledger: `/subledger/new` <br>• Edit Subledger: `/subledger/:id/edit` |
| 9 | Accounts Configuration & Setup > Master Configuration & Setup (F&A) | Voucher Approval Setup | `/accounts-config/voucher-approval-setup` |
| 10 | Accounts Configuration & Setup > Master Configuration & Setup (F&A) | Custom Field | `/accounts-config/custom-field` <br>*(Direct: `/custom-fields`)* <br>• Add Custom Field: `/custom-fields/new` <br>• Edit Custom Field: `/custom-fields/:id/edit` |
| 11 | Accounts Configuration & Setup > Master Configuration & Setup (F&A) | Customer Master Setup | `/customers` <br>*(Aliases: `/accounts-receivable/customer-master-setup`, `/accounts-receivable/customer-master-list`)* <br>• Add Customer: `/customers/new` <br>• Edit Customer: `/customers/:id/edit` |
| 12 | Accounts Configuration & Setup > Accounts Report Customization | Journal (Voucher Print Template) | `/accounts-report/journal` <br>*(Alias: `/voucher-template`)* <br>• Template Designer: `/voucher-template/designer` <br>• Edit Template: `/voucher-template/:id/edit` |
| 13 | Accounts Configuration & Setup > Accounts Report Customization | General Ledger | `/accounts-report/general-ledger` <br>*(Direct: `/reports/ledger/general-ledger`, Alias: `/general-ledger`)* |
| 14 | Accounts Configuration & Setup > Accounts Report Customization | Income Statement | `/accounts-report/income-statement` |
| 15 | Accounts Configuration & Setup > Accounts Report Customization | Balance Sheet | `/accounts-report/balance-sheet` |
| 16 | Accounts Configuration & Setup > Accounts Integration Configuration | HR Integration Configuration | `/accounts-integration-config/hr` |
| 17 | Accounts Configuration & Setup > Accounts Integration Configuration | Purchase Integration Configuration | `/accounts-integration-config/purchase` |
| 18 | Accounts Configuration & Setup > Accounts Integration Configuration | Inventory Integration Configuration | `/accounts-integration-config/inventory` |
| 19 | Accounts Configuration & Setup > Accounts Integration Configuration | Sales Integration Configuration | `/accounts-integration-config/sales` |
| 20 | Accounts Configuration & Setup > Accounts Integration Configuration | Production Integration Configuration | `/accounts-integration-config/production` |
| 21 | Accounts Payable Management (Purchase) | Supplier Master Setup | `/accounts-payable/supplier-master-setup` |
| 22 | Accounts Payable Management (Purchase) | Supplier Master List | `/accounts-payable/supplier-master-list` |
| 23 | Bank Management | Bank Master Setup | `/bank-management/bank-master-setup` <br>*(Direct: `/banks`)* <br>• Add Bank/Branch: `/banks/new`, `/branches/new` <br>• Edit Branch: `/branches/:id/edit` |
| 24 | Bank Management | Cheque Setup | `/cheque-setup` <br>*(Aliases: `/bank-management/cheque-setup`, `/cheques`, `/cheques/books`)* <br>• Add Cheque Book: `/cheques/books/new`, `/cheque-setup/new` <br>• Edit Cheque Book: `/cheques/books/:id/edit`, `/cheque-setup/:id/edit` |
| 25 | Bank Management | Cheque Preparation & Payment | `/cheque-prepare/direct` <br>*(Aliases: `/bank-management/cheque-preparation-payment`, `/cheque-prepare`)* <br>• Direct Payment: `/cheque-prepare/direct`, `/cheques/prepare/direct` <br>• Bill Payment: `/cheque-prepare/bill`, `/cheques/prepare/bill` <br>• IOU Payment: `/cheque-prepare/iou`, `/cheques/prepare/iou` <br>• Print Cheque: `/cheque-prepare/:preparedId/print`, `/cheques/:preparedId/print` |
| 26 | Bank Management | Cheque Book Register | `/cheque-prepare/register` <br>*(Aliases: `/bank-management/cheque-book-register`, `/cheques/register`)* |
| 27 | Bank Management | Bank Reconciliation | `/bank-management/bank-reconciliation` |
| 28 | Journal Books | Journal Entries | `/journal-entries` <br>*(Alias: `/journal-books/journal-entries`)* <br>• New Entry: `/journal-entries/new` <br>• Edit Entry: `/journal-entries/:id/edit` <br>• Print Voucher: `/journal-entries/:id/print` |
| 29 | Journal Books | Recurring Journal | `/recurring-journal` <br>*(Alias: `/journal-books/recurring-journal`)* <br>• New Recurring Schedule: `/recurring-journal/new` <br>• Edit Schedule: `/recurring-journal/:id/edit` |
| 30 | Journal Books | Preset Journal | `/journal-books/preset-journal` <br>*(Alias: `/preset-journal`)* <br>• New Preset: `/preset-journal/new` <br>• Edit Preset: `/preset-journal/:id/edit` |
| 31 | Journal Books | Bulk Data Upload | `/journal-books/bulk-data-upload` <br>*(Alias: `/bulk-upload`)* |
| 32 | Journal Books | Bulk Update | `/journal-books/bulk-update` <br>*(Alias: `/bulk-update`)* |
| 33 | Treasury Management | Forecasting Accounts | `/treasury-management/forecasting-accounts` <br>• Cash Flow Forecasting: `/treasury-management/forecasting-accounts/cash-flow` <br>• Daily Cash & Bank Position: `/treasury-management/forecasting-accounts/daily-position` |
| 34 | Treasury Management | Budgeting | `/treasury-management/budgeting` <br>• Fiscal Budget Master Setup: `/treasury-management/budgeting/master-setup` <br>• Budget Variance & Control Analysis: `/treasury-management/budgeting/variance-analysis` |
| 35 | Treasury Management | Cash & Liquidity Management | `/treasury-management/liquidity/fund-transfer` *(Inter-Account Fund Transfer)* |
| 36 | Treasury Management | Credit Facilities Setup | `/treasury-management/credit-facility/setup` *(Bank Facility & Limit Setup)* |
| 37 | Treasury Management | Investments & Term Deposit | `/treasury-management/investments/placement` *(FDR & Term Deposit Placement)* |
| 38 | Accounts Integration > HR Integration | Cash Requisition | `/accounts-integration/hr/cash-requisition` |
| 39 | Accounts Integration > HR Integration | Cash Payment | `/accounts-integration/hr/cash-payment` |
| 40 | Accounts Integration > HR Integration | Salary Disbursement | `/accounts-integration/hr/salary-disbursement` |
| 41 | Accounts Integration > Purchase Integration | Local Bill Disbursement | `/accounts-integration/purchase/local-bill-disbursement` |
| 42 | Accounts Integration > Purchase Integration | Import Disbursement | `/accounts-integration/purchase/import-disbursement` |
| 43 | Accounts Integration > Purchase Integration | BBLC Disbursement | `/accounts-integration/purchase/bblc-disbursement` |
| 44 | Accounts Integration > Inventory Integration | Inventory Transaction Posting | `/accounts-integration/inventory/transaction-posting` |
| 45 | Accounts Integration > Sales Integration | Local Sales Collection | `/accounts-integration/sales/local-sales-collection` |
| 46 | Accounts Integration > Sales Integration | Deemed Export Realization | `/accounts-integration/sales/deemed-export-realization` |
| 47 | Accounts Integration > Sales Integration | Export Realization | `/accounts-integration/sales/export-realization` |
| 48 | Accounts Integration > Production Integration | Production Integration | `/accounts-integration/production` |
| 49 | Reports > Ledger | Bulk Voucher Print | `/reports/ledger/bulk-voucher-print` |
| 50 | Reports > Ledger | General Ledger | `/reports/ledger/general-ledger` <br>*(Aliases: `/accounts-report/general-ledger`, `/general-ledger`)* |
| 51 | Reports > Ledger | Day Book | `/reports/ledger/day-book` |
| 52 | Reports > Ledger | Cash Book | `/reports/ledger/cash-book` |
| 53 | Reports > Ledger | Receipt and Payments Statement | `/reports/ledger/receipt-and-payments-statement` |
| 54 | Reports > Ledger | Employee Ledger | `/reports/ledger/employee-ledger` |
| 55 | Reports > Ledger | Supplier Ledger | `/reports/ledger/supplier-ledger` |
| 56 | Reports > Ledger | Customer Ledger | `/reports/ledger/customer-ledger` |
| 57 | Reports > Ledger | Trial Balance | `/reports/ledger/trial-balance` |
| 58 | Reports > Financial Statement | Income Statement | `/reports/financial-statement/income-statement` |
| 59 | Reports > Financial Statement | Retained Earnings Statement | `/reports/financial-statement/retained-earnings-statement` |
| 60 | Reports > Financial Statement | Balance Sheet | `/reports/financial-statement/balance-sheet` |
| 61 | Reports > Financial Statement | Cash Flow Statement (Indirect) | `/reports/financial-statement/cash-flow-statement-indirect` |
| 62 | Reports > Management Report | Budget Analysis | `/reports/management-report/budget-analysis` |
| 63 | Reports > Management Report | Cash Flow Analysis | `/reports/management-report/cash-flow-analysis` |
| 64 | Reports > Management Report | Comparison Analysis | `/reports/management-report/comparison-analysis` |
| 65 | Reports > Management Report | Dashboard | `/reports/management-report/dashboard` |
| 66 | Reports > Additional Report | Reference Center | `/reports/additional-report/reference-center` |
| 67 | Reports > Additional Report | Cost Center | `/reports/additional-report/cost-center` |
| 68 | Reports > Additional Report | Vehicle | `/reports/additional-report/vehicle` |
| 69 | System & Utilities | Settings | `/` *(System Configuration & Personalization Modal)* |
| 70 | System & Utilities | Help & Support | `/` *(Knowledge Base & Technical Support Drawer)* |
| 71 | System & Utilities | User Profile & Logout | `Action: Trigger Session Logout` |
