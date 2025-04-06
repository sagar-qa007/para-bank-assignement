import { Locator, Page } from "@playwright/test";

export class AccountsOverviewLib {
  readonly page: Page;
  private table: Locator;

  constructor(page: Page) {
    this.page = page;
    this.table = page.locator("#accountTable");
  }

  async getAllRows() {
    return this.table.locator("tbody tr");
  }

  async getRowData(row: number) {
    const rows = await this.getAllRows();
    return rows.nth(row).locator("td").allTextContents();
  }

  async getFooter() {
    return this.table.locator("tfoot tr td").textContent();
  }
}
