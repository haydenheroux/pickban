export class Time {
    private minutes_: number = 0;
    private seconds_: number = 0;

    public static from(string: string): Time {
        const tokens = string.split(":");

        const minutes = Number(tokens[0]);
        const seconds = Number(tokens[1]);

        return new Time().minutes(minutes).seconds(seconds);
    }

    public static minutes(minutes: number): Time {
        return new Time().minutes(minutes);
    }

    public static seconds(seconds: number): Time {
        return new Time().seconds(seconds);
    }

    public minutes(minutes: number): Time {
        this.minutes_ = minutes;
        return this;
    }

    public seconds(seconds: number): Time {
        this.seconds_ = seconds;
        return this;
    }

    public get totalMinutes(): number {
        return this.minutes_ + this.seconds_ / 60;
    }

    public get totalSeconds(): number {
        return this.minutes_ * 60 + this.seconds_;
    }
}