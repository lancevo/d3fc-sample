import d3 from 'd3';

export default function() {

    var bucketSize = 10;

    var bucket = function(data) {
        var numberOfBuckets = Math.ceil(data.length / bucketSize);

        return d3.range(0, numberOfBuckets).map((i) => {
            return data.slice(i * bucketSize, (i + 1) * bucketSize);
        });
    };

    bucket.bucketSize = function(x) {
        if (!arguments.length) {
            return bucketSize;
        }

        bucketSize = x;
        return bucket;
    };

    return bucket;
}
