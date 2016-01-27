/**
 * Created by yves on 16/1/26.
 */
(function($) {
    var __ = {
        treeTop: 'tree-top',
        treeBottom: 'tree-bottom',
        treeArray: ['tree-2', 'tree-6', 'tree-3', 'tree-4', 'tree-5'],
        eventTmpl: '<div class="container {{klass}}">' +
            '<div class="tree"></div>' +
            '<div class="event">' +
            '<div class="action">{{event.content}}</div>' +
            '<div class="time">{{event.date}}</div>' +
            '</div>' +
            '</div>'
    };
    $(function() {
        // get array
        // TODO: 滚动监听, 动态加载
        fetchEvents();
    });

    /**
     * 获取事件数据
     */
    function fetchEvents() {
        $.get('mock/events.json', function(data) {
            $('#J-tree').append(generateEventsHtml(data));
            $youziku.load(".event", "57fb4846c8714cf9970167a324e8c34b", "HaTian-SuiXing");
            //$youziku.load(".event", "d3cb691fe7b1446b96f53a1ad4d991a0", "ShanWenFeng");
            $youziku.draw();
        });
    }

    /**
     * 根据给定的事件数组生成对应的html内容
     * @param arr
     * @returns {Array}
     */
    function generateEventsHtml(arr) {
        // TODO: 判断first, 只特殊渲染第一次的first
        var length = arr.length;
        if(length <= 0) {
            return [];
        }
        var result = [],
            index = 1,
            step = __.treeArray.length,
            end = index + step;
        result.push(getEventHtmlByClass(__.treeTop, arr[0]));
        while(end <= length - 1) {
            result = result.concat(getSubArr(index, end));
            index = end;
            end = index + step;
        }
        result = result.concat(getSubArr(index, length - 1));
        result.push(getEventHtmlByClass(__.treeBottom, arr[length - 1]));

        function getSubArr(start, end) {
            var _subArr = arr.slice(start, end),
                _classArr = getRandomTreeArray(step),
                _ret = [];
            $.each(_classArr, function(i, klass) {
                _ret.push(getEventHtmlByClass(klass, _subArr[i]));
            });
            return _ret;
        }

        return result;
    }

    function getEventHtmlByClass(klass, event) {
        return Mustache.render(__.eventTmpl, {
            klass: klass,
            event: event
        })
    }

    /**
     * 获取随机不重复的树干序列
     * @param count {Number} 序列长度
     * @returns {Array} 树干序列
     */
    function getRandomTreeArray(count) {
        var _arr = generateRandomArray(generateRandomArray(__.treeArray));
        return _arr.slice(0, count);
    }

    /**
     * 将给定数组打乱
     * @param array
     * @returns {Array}
     */
    function generateRandomArray(array) {
        var arr = array.slice(0),
            len = arr.length;
        $.each(arr, function() {
            var _randomIndex = Math.floor(Math.random() * 100 % len);
            if(_randomIndex !== 0) {
                var temp = arr[0];
                arr[0] = arr[_randomIndex];
                arr[_randomIndex] = temp;
            }
        });
        return arr;
    }
})(jQuery);