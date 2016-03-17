import d3 from 'd3';
import identity from './util/identity';
import bucket from './bucket';

export default function() {

    var dataBucketer = bucket();
    var value = identity;

    const modeMedian = (data) => {

        if (dataBucketer.bucketSize() > data.length) {
            return data;
        }

        var minMax = d3.extent(data);
        var buckets = dataBucketer(data.slice(1, data.length - 1));

        var subsampledData = buckets.map((thisBucket, i) => {

            var frequencies = {};
            var mostFrequent;
            var singleMostFrequent = true;

            var values = thisBucket.map(value);
            var globalMinMax = values.filter((item) => {
                return item === minMax[0] || item === minMax[1];
            })[0];
            if (globalMinMax !== undefined) {
                return globalMinMax;
            }

            values.forEach((item) => {
                if (frequencies[item] === undefined) {
                    frequencies[item] = 0;
                }
                frequencies[item]++;

                if (frequencies[item] > frequencies[mostFrequent] || mostFrequent === undefined) {
                    mostFrequent = item;
                    singleMostFrequent = true;
                } else if (frequencies[item] === frequencies[mostFrequent]) {
                    singleMostFrequent = false;
                }
            });

            if (singleMostFrequent) {
                return mostFrequent;
            } else {
                return thisBucket[Math.floor(thisBucket.length / 2)];
            }
        });

        // First and last data points are their own buckets.
        return [].concat(data[0], subsampledData, data[data.length - 1]);
    };

    d3.rebind(modeMedian, dataBucketer, 'bucketSize');

    modeMedian.value = function(x) {
        if (!arguments.length) {
            return value;
        }

        value = x;

        return modeMedian;
    };

    return modeMedian;
}
