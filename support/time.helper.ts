export const timeHelper = {
    get_effective_date(): string {
        return String(new Date().getDate()).padStart(2, '0');
    },

    get_automatic_release_date_time(): Array<string> {
        var date = String(new Date().getDate()).padStart(2, '0');
        var time = new Date().toLocaleTimeString("en-US", {timeZone: 'America/New_York'}).split(':');
        var hour = parseInt(time[0]);
        var min = Math.ceil(parseInt(time[1])/5) * 5;
        if(parseInt(time[1]) ==  min){
            min = min + 5;  // if current ET time min and calculated min are same it will show error so adding 5 more mins 
        } 
        if(min == 60){
            // if the calculated min is 60 then add 1 to hour and make min to zero
            if(hour == 12){
                hour = 1;
            }
            else{
                hour = hour + 1; 
            }
            min = 0;
        }
        return [date, hour.toString(), min.toString()];
    },

    get_wait_time(auto_release_time: string): number {
        var release_time = auto_release_time.split(" ");
        var current_time = new Date().toLocaleTimeString("en-US", {timeZone: 'America/New_York'}).split(':');
        var date1 = new Date(`${release_time[0]} ${release_time[1]}:00.0000000`);
        var date2 = new Date(`${release_time[0]} ${current_time[0]}:${current_time[1]}:00.0000000`);
        let wait_time = date1.getTime() - date2.getTime();
        return wait_time;
    },
}