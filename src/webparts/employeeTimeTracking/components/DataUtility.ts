import * as pnp from 'sp-pnp-js';
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists/web";
import "@pnp/sp/items";
let currentUser = '';

export default class CommonUtility {
    
    public async SetupSP(context): Promise<void> {
        currentUser = context.pageContext.legacyPageContext.userId;
        await sp.setup({
            spfxContext: context
        });
    }

    public async AddSPItem(listname): Promise<any> {
        await sp.web.lists.getByTitle(listname).items.add({
            ProfileName: document.getElementById('ProfileName')["value"],
            ProfileJob: document.getElementById('ProfileJob')["value"]
        });
        alert("Record with Profile Name : " + document.getElementById('ProfileName')["value"] + " Added !");
    }

    public async UpdateSPItem(listname, ItemID): Promise<any> {
        await sp.web.lists.getByTitle(listname).items.getById(ItemID).update({
            ProfileName: document.getElementById('ProfileName')["value"],
            ProfileJob: document.getElementById('ProfileJob')["value"]
        });
        alert("Record with Profile ID : " + ItemID + " Updated !");
    }

    public async DeleteSPItem(listname, ItemID): Promise<any> {
        await sp.web.lists.getByTitle(listname).items.getById(ItemID).delete();
        alert("Record with Profile ID : " + ItemID + " Deleted !");
    }

    public getLists(): Promise<any[]> {
        return sp.web.lists();
    }

    public async getAllItems(listname): Promise<any> {
        return await sp.web.lists.getByTitle(listname).items.filter('Author eq '+currentUser).select('*,Author/Title').expand('Author').getAll();
    }

    public setStandardDateFormat(date: Date) {
        return (((date.getMonth() + 1) >= 10 ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '/' + (date.getDate() >= 10 ? date.getDate() : ('0' + date.getDate())) + '/' + date.getFullYear());
    }
}