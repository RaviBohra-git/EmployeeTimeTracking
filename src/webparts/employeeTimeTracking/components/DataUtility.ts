import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists/web";
import "@pnp/sp/items";
import "@pnp/sp/fields";
import * as moment from 'moment';
let currentUser = '';

export default class CommonUtility {

    public async SetupSP(context): Promise<void> {
        currentUser = context.pageContext.legacyPageContext.userId;
        await sp.setup({
            spfxContext: context
        });
    }

    public async AddSPItem(listname, dataObj): Promise<any> {
        let overTime = false;
        let todayEntries = await this.getTodaysEntries(listname);
        let totalWorkedHours = 0;
        todayEntries.map((TimeEntry) => {
            totalWorkedHours += TimeEntry.Hours;
        });
        totalWorkedHours += parseInt(dataObj.Hours);
        if (totalWorkedHours > 8)
            overTime = true;
        console.log(totalWorkedHours);
        await sp.web.lists.getByTitle(listname).items.add({
            Title: (dataObj.Title ? dataObj.Title : ""),
            Description: (dataObj.Description ? dataObj.Description : ""),
            Category: (dataObj.Category ? dataObj.Category : ""),
            Hours: (dataObj.Hours ? parseInt(dataObj.Hours) : 0),
            OverTime: overTime
        });
    }

    public async UpdateSPItem(listname, ItemID, dataObj): Promise<any> {

        let overTime = false;
        let todayEntries = await this.getTodaysEntries(listname);
        let totalWorkedHours = 0;
        todayEntries.map((TimeEntry) => {
            if (TimeEntry.ID != parseInt(ItemID))
                totalWorkedHours += TimeEntry.Hours;
            // else
            //     totalWorkedHours += TimeEntry.Hours;
        });
        totalWorkedHours += parseInt(dataObj.Hours);
        if (totalWorkedHours > 8)
            overTime = true;
        console.log(totalWorkedHours);
        await sp.web.lists.getByTitle(listname).items.getById(parseInt(ItemID)).update({
            Title: (dataObj.Title ? dataObj.Title : ""),
            Description: (dataObj.Description ? dataObj.Description : ""),
            Category: (dataObj.Category ? dataObj.Category : ""),
            Hours: (dataObj.Hours ? parseInt(dataObj.Hours) : 0),
            OverTime: overTime
        }).catch((error) => { console.log(error); });
    }

    public async DeleteSPItem(listname, ItemID): Promise<any> {
        await sp.web.lists.getByTitle(listname).items.getById(ItemID).delete();
    }

    public getLists(): Promise<any[]> {
        return sp.web.lists();
    }

    public async getAllItems(listname): Promise<any> {
        let today: any = new Date();
        let nextday: any = moment(today).add(1, 'days');
        today = moment(today).format("YYYY-MM-DD");
        let currentDate = today + 'T00:00:00.000Z';
        nextday = moment(nextday).format("YYYY-MM-DD");
        let nextDate = nextday + 'T00:00:00.000Z';
        return await sp.web.lists.getByTitle(listname).items.filter('Author eq ' + currentUser + " and (Created ge datetime'" + currentDate + "' and Created le datetime'" + nextDate + "')").select('*,Author/Title').expand('Author').getAll();
    }

    public async getItemById(listname, ItemId): Promise<any> {
        return await sp.web.lists.getByTitle(listname).items.getById(ItemId).get();
    }

    public async getCategoryChoices(listname): Promise<any> {
        return await sp.web.lists.getByTitle(listname).fields.getByTitle('Category').get();
    }

    public async getTodaysEntries(listname): Promise<any> {
        let today: any = new Date();
        let nextday: any = moment(today).add(1, 'days');
        today = moment(today).format("YYYY-MM-DD");
        let currentDate = today + 'T00:00:00.000Z';
        nextday = moment(nextday).format("YYYY-MM-DD");
        let nextDate = nextday + 'T00:00:00.000Z';
        return await sp.web.lists.getByTitle(listname).items.filter("Author eq " + currentUser + " and (Created ge datetime'" + currentDate + "' and Created le datetime'" + nextDate + "')").getAll();
    }

    public setStandardDateFormat(date: Date) {
        return (((date.getMonth() + 1) >= 10 ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '/' + (date.getDate() >= 10 ? date.getDate() : ('0' + date.getDate())) + '/' + date.getFullYear());
    }

}