=====================================================
メタプログラミングPython
=====================================================

| tell-k
| PyCon JP 2016 (2016.09.22)

君の名は
=====================================

.. image:: https://pbs.twimg.com/profile_images/775582814871752704/J1TaucBz_400x400.jpg
.. image:: https://dl.dropboxusercontent.com/spa/ghyn87yb4ejn5yy/vxjmiemo.png

* tell-k
* BeProud.inc
* 情弱プログラマー
* https://twitter.com/tell_k
* https://tell-k.github.io/pyconjp2016/

ジムリーダーもやってました(5分で陥落...)
==================================================

.. image:: https://pbs.twimg.com/media/Cs2O52rUMAATHRK.jpg
   :width: 40%

Beproud.inc - connpass
====================================

.. figure:: https://dl.dropboxusercontent.com/spa/ghyn87yb4ejn5yy/okbyv2hm.png

   http://connpass.com/

Beproud.inc - PyQ
====================================

.. figure:: https://dl.dropboxusercontent.com/spa/ghyn87yb4ejn5yy/wfzr_05v.png

   https://pyq.jp/

* 今年はブースも出してます！
* シールがもらえたり、connpassの説明をしてくれたり、PyQを体験したりできるそうです！
* 是非足を運んでみてください！(もう時間ないけど...)

目的/動機
=====================================

* ふとPythonでメタプログラミングってどうやるんだ？という疑問が湧きました
* ``metaclass`` などの漠然とした知識/利用はあったけど具体的にどこまでの話なのか分からず。
* そんな時 **メタプログラミングRuby** という本を思い出しました。

メタプログラミングRuby
=====================================

.. figure:: https://dl.dropboxusercontent.com/spa/ghyn87yb4ejn5yy/felfgfdn.png
   :width: 35%

   https://www.oreilly.co.jp/books/9784873117430/

目的/動機
=====================================

* この **メタプロラグミングRuby** を参考にしつつPythonだったらどうやるのか？
* Pythonのメタプログラミングで出てくるトピックにはどんなものがあるのか？
* そういう話を広く浅くまとめてみようと思った次第です。(ごった煮ともいいます...)

対象
=====================================

* Python使い始めたが、もう一歩詳しくなりたい人
* 自分でOSSなどで、Pythonのライブラリ、フレームワークを作ってみたい人
* やむにやまれず、ゴツいライブラリにダイブしなければいけない人

前提
=====================================

* 特に断りがなければ、Python3.5 前提でお話しをします。
* Ruby のサンプルコードは Ruby2.0 です。
* **メタプログラミングRuby** から 用語名などをちょいちょい拝借してます。
* Pythonでは、そもそもそんな言い方しない可能性があるのでその辺注意してください。

目次
==========================================

* メタプログラミングとは？
* Class とは？
* Dynamic Dispatch/Method
* SingularMethod/GhostMethod
* Metaclass/Decorator/Descriptor/Moneky Patch/Operator Overload
* DSL/Open Class/eval/exec/Import Hook
* 参考
* まとめ

メタプログラミングとは？
===============================

  Metaprogramming is the writing of computer programs with the ability to treat programs as their data.
  It means that a program could be designed to read, generate,
  analyse or transform other programs, and even modify itself while running.
  In some cases, this allows programmers to minimize the number of lines of
  code to express a solution (hence reducing development time)
  or it gives programs greater flexibility to efficiently handle new situations without recompilation.

  -- https://en.wikipedia.org/wiki/Metaprogramming

メタプログラミングとは？
===============================

  メタプログラミングとは、データとしてプログラム自体を処理できるプログラムを記述することです。プログラムからプログラムを、読んだり、分析したり、他のプログラムに変換したり、さらに実行時に自らのプログラムを変更することを意味します。これは、いくつかのケースで、プログラマに最小限のコードで、解決策を記述できるようにしてくれます。 (つまり開発時間の短縮につながる) または、プログラムを再コンパイルする必要なしに、柔軟に新しい状況に対応できるようにしてくれます。

  -- https://en.wikipedia.org/wiki/Metaprogramming (意訳です)

メタプログラミングとは？
===============================

* **コードを記述するコードを記述すること**
* 言語要素を実行時に操作するコード記述すること
* Ruby、Pythonなどの動的な言語においては、実行時に自分自身を書き換え/実行することと理解できる
* コードにコードを記述させることで、**DRY** を実現したり、コードを書く量を削減して開発効率をあげることができる

Class とは？
======================================

* 本題に入る前に、前提としてクラス周りの話を軽くおさらい
* Pythonにおけるクラスとはなんなのか？

Class とは？
======================================

* ``type`` クラス ... 全てのクラスの雛形
* ``type`` にオブジェクトを渡すと型が帰ってきますが関数ではありません。
* クラス定義 は ``type`` クラス のインスンタス

Class とは？
======================================

.. code-block:: python
 :linenos:

 import inspect

 print(inspect.isclass(object))  # => True
 print(isinstance(object, type)) # => True
 print(inspect.isclass(type))    # => True
 print(isinstance(type, object)) # => True

 class Spam: pass

 print(inspect.isclass(Spam))    # => True
 print(isinstance(Spam, type))   # => True
 print(isinstance(Spam, object)) # => True

 spam = Spam()

 print(inspect.isclass(spam))    # => False
 print(isinstance(spam, type))   # => False
 print(isinstance(spam, Spam))   # => True
 print(isinstance(spam, object)) # => True

 print(isinstance(type, type))   # => True

Class とは?
====================================

.. image:: https://dl.dropboxusercontent.com/spa/ghyn87yb4ejn5yy/cpkttkrf.png
   :width: 50%

* `Pythonのオブジェクトとクラスのビジュアルガイド – 全てがオブジェクトであるということ <http://postd.cc/pythons-objects-and-classes-a-visual-guide/>`_

type
======================================

* もう少し ``type`` について詳しく見る

.. code-block:: python
 :linenos:

 class type(name, bases, dict)

 # refs http://docs.python.jp/3/library/functions.html#type

* ``name`` ... クラス名
* ``bases`` ... 継承元の親クラス(tuple)
* ``dict`` ... 名前空間 => 属性(メソッド/プロパティ)を管理する辞書

type
======================================

* ``type`` から動的にクラスが生成可能
* メソッドは ``self`` を受け取る関数であればいい

.. code-block:: python
 :linenos:

 # 前のスライドのクラス定義と同義
 def hello(self):
     print('Hello! My name is {}'.format(self.name))

 # type を call することで クラスが生成できる
 Spam = type('Spam', (), dict(name='tell-k', hello=hello))

 spam = Spam()
 spam.hello() # => 'Hello! My name is tell-k'

type
======================================

* ちなみに組み込みの型はだいたいクラス => ``type`` のインスタンス

.. code-block:: python
 :linenos:

 print(isinstance(str, type))   # => True
 print(isinstance(int, type))   # => True
 print(isinstance(float, type)) # => True
 print(isinstance(dict, type))  # => True
 print(isinstance(list, type))  # => True
 print(isinstance(tuple, type)) # => True
 print(isinstance(set, type))   # => True

 print(isinstance(types.FunctionType, type))  # => True
 print(isinstance(types.MethodType, type))  # => True
 print(isinstance(None, type))  # => True

 # 組み込みの名前を持たない型(functionとか) 全てtypesに定義してある
 # refs http://docs.python.jp/3/library/types.html

 # type 自体も typeのインスタンス
 print(isinstance(type, type))  # => True

Class のまとめ
======================================

* Class は ``type`` のインスタンス
* Class は ``type`` により 動的に定義することが可能
* 全ての型は Class であり ``type`` のインスタンスである

Dynamic Dispatch/Method
=======================================

* メタプログラミングをやっていると、「動的に〜」というのが頻出します。
* その中でも **動的にメソッドを実行/定義する** というのがよく出てきます。

.. code-block:: python
 :linenos:

 # python --
 # 動的にメソッド実行 --
 str_obj = '1,2,3'
 getattr(str_obj, 'split')(',') # => ["1", "2", "3"]
 # = str_obj.split(',') と等価

 # 動的にメソッド定義 --
 class Spam: pass

 def hello(self): # selfを受け取る関数
     print('Hello')

 Spam.hello = hello # クラスにアサインするだけ
 spam = Spam()
 spam.hello() # => Hello

Ghost Method
=======================================

* Ruby には ``method_missing`` メソッドがクラスに備わっています。
* ``method_missing``  によって **該当のないメソッドの呼び出し** に応答する
* 別のオブジェクトにメソッドを呼び出し転送することにも使える( **Dynamic Proxy** )

.. code-block:: python
 :linenos:

 # ruby --
 class Spam
   def method_missing(name, *args, &block)
      args[0].reverse # 文字列を反転する
   end
 end

 spam = Spam.new()
 # 存在しないメソッド「ghost_reverse」をcall
 p spam.ghost_reverse('spam') # => 'maps'

Ghost Method
=======================================

* Python では ``__getattr__`` という **スペシャルメソッド** が利用できる
* ``__getattr__`` は 該当のない **属性のアクセス時** に呼ばれる
* Rubyの ``method_missing`` はメソッドが呼び出されて初めて実行されます

.. code-block:: python
 :linenos:

 # python --
 class Spam:

   def __getattr__(self, name):
       def _reverse(*args):
           return args[0][::-1]
       return _reverse

 spam = Spam()
 # spam.gohsrt_revers にアクセス -> _reverse 関数がreturn -> _reverse関数をcall
 print(spam.ghost_reverse('spam')) # => 'maps'

Ghost Method - bit.ly
=======================================

* Python の **Ghost Method** の利用例
* https://github.com/hellp/bitlyapi/ (大分古い。Python2のみサポート)

.. code-block:: python
 :linenos:

 # python --
 api = bitly.BitLy(API_USER, API_KEY)
 res = api.shorten(longUrl='http://github.com/larsks')
 print res['http://github.com/larsks']['shortUrl']

 # 実は shorten というメソッドは存在しない

Ghost Method - bit.ly
=======================================

* メソッドをAPIのエンドポイントのパスとして扱う

.. code-block:: python
 :linenos:

 # python -- 注: python2 で書かれてます
 def __getattr__ (self, func):
   def _ (**kwargs):
       #  self.api_url          +  func
       # 'http://api.bit.ly/v3' + 'shorten' => 'http://api.bit.ly/v3/shorten'
       url = '/'.join([self.api_url, func])
       # kwargs -> longUrl はクエリパラメータとしてそのまま渡す
       query_string = self._build_query_string(kwargs)
       fd = urllib.urlopen(url, query_string)
       res = json.loads(fd.read())

       if res['status_code'] != 200:
           raise APIError(res['status_code'], res['status_txt'], res)
       elif not 'data' in res:
           raise APIError(-1, 'Unexpected response from bit.ly.', res)
       return res['data']
   return _

 # refs https://github.com/hellp/bitlyapi/blob/master/bitlyapi/bitly.py

Singular Method
=======================================

* 特定のオブジェクト **だけに** 動的にメソッドを追加する
* Rubyでは **特異メソッド** と呼ばれる機能

.. code-block:: ruby
 :linenos:

 # ruby --
 spam1 = Spam.new()
 spam2 = Spam.new()

 def spam1.bye
   p 'ByeBye'
 end

 spam1.bye() # => 'ByeBye'
 spam2.bye() # => NoMethodError

Singular method
=======================================

* オブジェクトに関数をアサインするだけではダメ
* Python オブジェクトにbind(束縛)して初めてメソッドとして利用可能です
* 束縛されている = **Bound Method**
* 束縛されてない = **Unbound Method**

.. code-block:: python

 # python --
 class Spam:
     def hello(self):
         print('Hello')

 s = Spam()

 print(Spam.hello) # => <function Spam.hello at 0x1083388c8>
 print(s.hello) # => <bound method Spam.hello of <__main__.Spam object at 0x1083349b0>>


Singular method
=======================================

.. code-block:: python
 :linenos:

 # python --
 def bye(self):
     print('ByeBye')

 spam = Spam()
 spam.bye = bye
 spam.bye() # => TypeError: bye() missing 1 required positional argument: 'self'

 # Bound Method を作るためにMethodTypeを利用する
 from types import MethodType
 spam.bye = MethodType(bye, Spam)
 spam.bye() # => "ByeBye"


Monkey Patch
=======================================

* 元のコードを変更することなく、動的にコードを拡張/変更する事の総称です。
* ライブラリのコードを直接変えたくない時とかに利用します
* テスト系のライブラリ( ``unittest.mock.patch`` 等) でおなじみ

.. code-block::  python
 :linenos:

 # spam.py ----
 def hello():
     return 'Hello! Spam'

 # ham.py  ----
 import spam
 def patch_hello():
     return 'HamHamHamHam!'
 spam.hello = patch_hello # helloを差し替える

 # main.py -----
 import ham  # パッチがあたる
 import spam

 spam.hello() # => 'HamHamHamHam!'

Monkey Patch
=======================================

* どこでパッチを当ててるのか分からなくなったりすると **地獄**
* 例えば ``with`` を 利用するなりして影響範囲を限定的にするのが良い
* あとは、必ずオリジナルに処理に戻せる手段を用意しましょう

.. code-block::  python
 :linenos:

 # python --
 class PatchHello:
     def __enter__(self):
         self.original_hello = spam.hello # オリジナルを保存
         spam.hello = patch_hello # 差し替え
         return self
     def __exit__(self, exec_type, exec_value, traceback):
         spam.hello = self.original_hello # オジリナルを復元

 with ham.PatchHello():
     print(spam.hello()) # => 'HamHamHamHam!'
 spam.hello() # => 'Hello! Spam'

Monkey Patch - gevent
=======================================

* gevent ... http://www.gevent.org/
* 非同期プログラミングをサポートする並行ライブラリ
* gevent の提供する処理を、Pythonの標準ライブラリにパッチをあてて利用することが可能
* `Python プログラマーのための gevent チュートリアル <http://methane.github.io/gevent-tutorial-ja/#_4>`_

.. code-block:: python
 :linenos:

 # python --
 from gevent import monkey
 monkey.patch_all()

 # いろんな標準パッケージ/モジュールにパッチが当たる
 # patch_os
 # patch_time
 # patch_thread
 # patch_sys
 # patch_socket
 # patch_select
 # patch_ssl
 # patch_subprocess
 # patch_signal

Monkey Patch - gevent
=======================================

.. code-block:: python
 :linenos:

   pathc_module('os')

   def patch_module(name, items=None):
       # 1. 「gevent.os」 をimport ---
       gevent_module = getattr(__import__('gevent.' + name), name)
       module_name = getattr(gevent_module, '__target__', name)
       # 2. 標準の「os」をimport ---
       module = __import__(module_name)
       if items is None:
           # 3. 「gevent.os.__implements__」 パッチ対象を取得(gevent.os.fork) ---
           items = getattr(gevent_module, '__implements__', None)
           if items is None:
               raise AttributeError('%r does not have __implements__' % gevent_module)
       for attr in items:
           # 4. 「gevent.os.fork」 -> 「os.fork」 にセット
           patch_item(module, attr, getattr(gevent_module, attr))
           # path_itemではオリジナルが保存されてるので後で戻すこと可能
       return module

   # refs https://github.com/gevent/gevent/blob/master/src/gevent/monkey.py#L151

Metaclass
======================================

* **Metaclass** = クラスを生成する雛形となるクラス
* デフォルトは ``type`` が ``metaclass`` として設定されてます
* **Metaclass** を ``type`` 以外のクラスに差し替え可能
* つまり **クラス定義そのものをカスタマイズ可能** という事です
* 代表的な例として抽象基底クラスを作る ``abc.ABCMeta`` などがあります。
* http://docs.python.jp/3.5/library/abc.html

Metaclass
======================================

* クラス定義すると、自動的に ``hello`` メソッド を追加する **Metaclass** を作成
* **Metaclass** を差し替える時はクラス宣言時に ``metalcass`` を指定するだけです。

.. code-block:: python
 :linenos:

  # python --
  class HelloMeta(type):

      def __new__(cls, name, bases, attrs):

          def _hello(self):
              return print('My name is {}.'.format(self.name)

          # 名前空間(クラス辞書) にhelloメソッドをセット
          attrs['hello'] = _hello
          return super().__new__(cls, name, bases, attrs)

  class Spam(metaclass=HelloMeta): # <= metaclasss を指定
      name = 'Spam'

  spam = Spam()
  spam.hello() # => "My name is Spam"

Metaclass
======================================

* 名前空間だけを変更したいのであれば ``__prepare__`` が使えます
* 例えば名前空間を ``dict`` から ``OrderedDict`` に変えるなど。
* http://docs.python.jp/3.5/reference/datamodel.html#preparing-the-class-namespace

Metaclass - Flask MethodView
=======================================

* Flask(http://flask.pocoo.org/) -> Webフレームワーク
* HTTPリクエストと受け付ける ``View`` というクラスがある
* クラス変数 ``View.methods`` = アクセスを許可するHTTPメソッドのリストが指定可能
* ``MethodView`` は 実装されたメソッド名から自動的に ``methods`` という属性を設定してくれる

.. code-block:: python
 :linenos:

 # python --
 from flask.views import MethodView

 class GetAndPostMethodView(MethodView):

     def get(self): # GETアクセスが可能になる

     def post(self): # POSTアクセスが可能になる

 # 定義したメソッド名が「methods」として自動で登録される
 GetAndPostMethodView.methods # => ['GET', 'POST']

Metaclass - Flask MethodView
=======================================

* 名前空間(クラス辞書)から定義されたメソッド名を取得
* クラス変数 ``methods`` に自動的にセット

.. code-block:: python
 :linenos:

 # python --
 class MethodViewType(type):

     def __new__(cls, name, bases, d):
         # d には post , get などのメソッドがセットされている
         rv = type.__new__(cls, name, bases, d)
         if 'methods' not in d:
             methods = set(rv.methods or [])
             for key in d:
                 # メソッド が HTTPメソッド と同名であれば 自動で登録
                 if key in http_method_funcs:
                     methods.add(key.upper())
             if methods:
                 rv.methods = sorted(methods)
         return rv

 class MethodView(with_metaclass(MethodViewType, View)):
       ...

 # refs https://github.com/pallets/flask/blob/master/flask/views.py#L105

Decorator
=======================================

* 関数をラップする関数を生成する ≒ コードを記述するコード

.. code-block:: python
 :linenos:

 def hello(func):
     def inner()
         ret = func()
         return 'Hello! My name is {}'.format(ret)
     return inner

 @hello
 def spam():
     return 'spam'

 spam() # => 'Hello! My name is spam'

Decorator - functools.total_ordering
=======================================

* メタっぽいデコレーターの例
* 一部の比較メソッドするだけで、全ての順序比較が可能なクラスを作ってくれる
* ``__eq__`` を実装が必要
* ``__lt__, __le__, __gt__, __ge__`` の **どれか一つ** の実装が必要
* それ以外の比較のメソッドを自動的に実装してくれる
* http://docs.python.jp/3/library/functools.html#functools.total_ordering

Decorator - functools.total_ordering
=======================================

.. code-block:: python
 :linenos:

 import functools

 @functools.total_ordering
 class Person:
     def __init__(self, score):
         self.score = score
     def __eq__(self, other):
         return self.score == other.score
     def __lt__(self, other):
         return self.score < other.score

 p1 = Person(2)
 print(p1 == Person(2))  # __eq__ 実装
 print(p1 < Person(3))   # __lt__ 実装
 # 残りのメソッド群を自動実装 ---
 print(p1 > Person(1))   # __gt__ 自動実装
 print(p1 <= Person(2))  # __le__ 自動実装
 print(p1 >= Person(2))  # __ge__ 自動実装

Decorator - functools.total_ordering
=======================================

.. code-block:: python
 :linenos:

 # 実装された __lt__ を使って __gt__ の比較を実現するメソッド
 def _gt_from_lt(self, other, NotImplemented=NotImplemented):
     op_result = self.__lt__(other)
     if op_result is NotImplemented:
         return op_result
     return not op_result and self != other

 def total_ordering(cls):
     roots = [op for op in _convert if getattr(cls, op, None) is not getattr(object, op, None)]
     if not roots:
         raise ValueError('must define at least one ordering operation: < > <= >=')
     root = max(roots)

     # [('__gt__', _gt_from_lt), ('__le__', _le_from_lt), ('__ge__', _ge_from_lt)]
     for opname, opfunc in _convert[root]:
         if opname not in roots:
             opfunc.__name__ = opname
             setattr(cls, opname, opfunc) # クラスにメソッドを動的に定義
     return cls

Descriptor
=======================================

* オブジェクトの属性アクセスをカスタマイズするための仕組み
* データディスクリプタ ... ``__get__`` , ``__set__`` の両方実装が必要
* 非データディスクリプタ ... ``__get__``  のみ実装が必要
* 実装すべきメソッド群のことを **プロトコル** といいます
* http://docs.python.jp/3.5/howto/descriptor.html
* `Python を支える技術 ディスクリプタ編 <http://qiita.com/knzm/items/a8a0fead6e1706663c22>`_

Descriptor
=======================================

* セットした値を二乗して返すディスクリプタ
* ``@property`` デコレーターも中でデータディスクリプタを作ってる

.. code-block:: python
 :linenos:

  class PowDescritor:
      def __get__(self, obj, type=None):
          # # obj(= instance)が渡ってこない時はクラス属性として呼ばれている
          if not obj:
             return self
          return getattr(obj, '_score') ** 2
      def __set__(self, obj, value):
          setattr(obj, '_score', value)
      def __delete__(self, obj):
          if hasattr(obj, '_score'):
              del obj._value

  class Spam:
      score = PowDescritor()

  spam = Spam()
  spam.score = 2
  print(spam.score) # => 4
  spam.score = 3
  print(spam.score) # => 9
  del spam.score
  print(spam.score) # => AttributeError

Descriptor
=======================================

* ディスクリプタの例を見る前に。
* Pythonオブジェクトの属性へのアクセスには優先順位があります
* オブジェクトの属性アクセスをすると**必ず** ``__getattribute__`` が呼ばれます
* ``__getattribute__`` は下記の順番でデータを取得しようとします。

::

 1. データディスクリプタからデータを取得
 2. 属性辞書からデータを取得
 3. 非データディスクリプタからデータを取得

Descriptor - reify
=======================================

* Pyramid(https://github.com/Pylons/pyramid/) の メソッドデコレータ
* 属性アクセスの優先順位を生かしたDescriptorの実装をしています。
* 1度アクセスしたメソッドの実行結果をキャッシュ
* 2回目の以降はメソッドの実行を省略できる

.. code-block:: python
 :linenos:

 from datetime import datetime
 from pyramid.decorator import reify

 class Spam:

     @reify
     def now(self):
         return datetime.now()

 spam = Spam()
 spam.now # nowメソッド実行
 spam.now # nowメソッドの実行はスキップ、キャッシュされた結果が手にはいる

Descriptor - reify
=======================================

* ``reify`` は **非データディスクリプタ** = つまり属性アクセスの優先順位が一番低い
* ラップしたメソッドの実行結果を **属性辞書** に ダイレクトにセット
* **属性辞書** の方が優先順位が高いので、以降メソッドは呼ばれない

.. code-block:: python
 :linenos:

 class reify(object):
     ...

     def __get__(self, inst, objtype=None):
         if inst is None:
             return self
         val = self.wrapped(inst)
         # メソッドの実行結果をダイレクトに属性辞書にセット
         setattr(inst, self.wrapped.__name__, val)
         return val

 # refs https://github.com/Pylons/pyramid/blob/master/pyramid/decorator.py#L39

Operator Overload
=======================================

* 演算子の挙動をカスタマイズできる
* 比較演算子(``==``, ``>``, ``>=``, ``<``, ``<=``), 算術演算子(``+``, ``-``, ``/``, ``＊``, ``%``, ``//``, ``**``),
* 方法はオブジェクトに演算子に対応する **Special Method** を実装する
* http://docs.python.jp/3.5/reference/datamodel.html#special-method-names

Operator Overload
=======================================

* オブジェクト同士を「 ``+`` 」演算子で加算できるようにする
* 左に右を加算

.. code-block:: python
 :linenos:

 class Spam:
     def __init__(self, value):
         self.value = value
     def __add__(self, other):
         self.value += other.value
         return self

 s = Spam(1) + Spam(1) # プロパティvalue同士を加算
 print(s.value) # => 2

Operator Overload
=======================================

* 数値リテラルも ``Spam.value`` に加算できるようにしたい

.. code-block:: python
 :linenos:

 class Spam:
     def __init__(self, value):
         self.value = value
     def __add__(self, other):
         # value の有無で加算対象を変える other.value or other
         self.value += getattr(other, 'value', other)
         return self

 (Spam(1) + Spam(1)).value # => 2
 (Spam(1) + 1).value       # => 2

 1 + Spam(1) # TypeError: unsupported operand type(s) for +: 'int' and 'Spam'

Operator Overload
=======================================

* ``int`` の ``__add__`` が実行されるのでエラー
* ``__radd__`` メソッドを定義すると、右を左に渡すように向きが変わる

.. code-block:: python
 :linenos:

 class Spam:
     def __init__(self, value):
         self.value = value
     def __add__(self, other):
         self.value += getattr(other, 'value', other)
         return self
    def __radd__(self, other):
        return self.__add__(other)

 (1 + Spam(1)).value # => 2

Operator Overload - SQLAlchemy
=======================================

.. code-block:: python
 :linenos:

 from sqlalchemy import Column, Integer

 Base = declarative_base()
 Base.query = db_session.query_property()

 class User(Base):
     __tablename__ = 'users'
     id = Column(Integer, primary_key=True)

 print(User.query.filter(User.id == 1)) # User.id == 1 の結果が boolじゃない
 # SELECT users.id AS users_id FROM users WHERE users.id = :id_1

 print(User.id == 1) # => users.id = :id_1
 print(User.id > 1)  # => users.id > :id_1
 print(User.id >= 1) # => users.id >= :id_1
 print(User.id < 1)  # => users.id < :id_1
 print(User.id <= 1) # => users.id <= :id_1
 print(-User.id) # => -users.id
 print(~User.id) # => NOT users.id
 print((User.id == 1) | (User.id == 1)) # => users.id = :id_1 OR users.id = :id_2
 print((User.id == 1) & (User.id == 1)) # => users.id = :id_1 AND users.id = :id_2

Operator Overload - SQLAlchemy
=========================================

* ``Column`` クラスに演算子をOverloadする実装がされています。

.. code-block:: python
 :linenos:

 class ColumnOperators(Operators):

   def __eq__(self, other):
       """Implement the ``==`` operator.

       In a column context, produces the clause ``a = b``.
       If the target is ``None``, produces ``a IS NULL``.

       """
       return self.operate(eq, other)

 # refs: https://github.com/zzzeek/sqlalchemy/blob/master/lib/sqlalchemy/sql/operators.py#L235

eval/exec
=======================================

* 文字列をPythonコードとして評価/実行
* ``eval`` は単一の式を評価, ``exec`` は複数の文を評価
* http://docs.python.jp/3.5/library/functions.html#eval

.. code-block:: python
 :linenos:

 # eval ---
 spam = 1
 ham = 2
 egg = eval('spam + ham')
 print(egg) # => 3

 # exec ---
 code = """
 spam = 1
 ham = 2
 egg = spam + ham
 """
 exec(code)
 print(egg) # => 3

eval/exec - namedtuple
=======================================

* 名前付きの **tuple**
* **tuple** を継承したクラスが動的に生成

.. code-block:: python
 :linenos:

 # python --
 from collections import namedtuple

 Person = namedtuple('Person', ('first', 'last'))
 p1 = Person(first='spam', last='ham')
 print(p1.first) # => spam
 print(p1.last)  # => ham

 print(type(Person)) # => <class 'type'>
 print(type(p1))     # => <class '__main__.Person'>

eval/exec - namedtuple
=======================================

.. code-block:: python
 :linenos:

 # collections/__init__.py --
 # (注) 大分端折ってます
 _class_template = """\
 from builtins import property as _property, tuple as _tuple
 from operator import itemgetter as _itemgetter
 from collections import OrderedDict

 class {typename}(tuple):
     '{typename}({arg_list})'

     __slots__ = ()

     _fields = {field_names!r}

     def __new__(_cls, {arg_list}):
         'Create new instance of {typename}({arg_list})'
         return _tuple.__new__(_cls, ({arg_list}))
  """

  namespace = dict(__name__='namedtuple_%s' % typename)
  exec(class_definition, namespace)

Dynamic Module
=======================================

* 動的にモジュールを生成する
* ``types`` に **モジュール** ための型( ``types.ModuleType`` )が存在する
* その型を使って動的に生成することが可能

.. code-block:: python
 :linenos:

 import types
 import sys

 spam_module = types.ModuleType('spam', 'dynamic generated module')
 spam_class = """
 class Spam:
     def hello(self):
         print('Hello')
 """
 exec(spam_class, spam_module.__dict__) # spamモジュールの名前空間に所属させる
 sys.modules['spam'] = spam_module

 import spam
 s = spam.Spam()
 s.hello() # => 'Hello'

DSL
=======================================

* Domain specific language
* 特定の作業の遂行や問題の解決に特化して設計された言語
* 言語機能を利用したDSL -> 内部DSL

* `Fantastic DSL in Python <http://www.slideshare.net/kwatch/fantastic-dsl-in-python>`_

  * ``with``/``for``/``decorator`` を駆使してDSLを実現するテクニックが説明されています

* `PythonはDSLが苦手？ <http://atsuoishimoto.hatenablog.com/entry/20120821/1345537686>`_

  * 後述する ``ast`` モジュールを使ってDSLを実現

DSL - ploblem of 'with statetment'
=======================================

* ブロックが必ず実行されてしまう -> スキップ可能にしたい
* スコープが共有されてしまう -> スコープを独立させたい
* スキップ可能 ``with`` に関しては過去にPEPで提案済み。だが却下。
* `PEP 377 -- Allow __enter__() methods to skip the statement body <https://www.python.org/dev/peps/pep-0377/>`_
* アイディアはあるが、ここでは割愛。興味がある人はgistを参照してください。
* https://gist.github.com/tell-k/c7552ef551f06620e2f029f1495fe173

.. code-block:: python
 :linenos:

 # python --
 spam = 'spam'

 with ham('ham1'):
     spam = 'ham'  # 必ず実行 ブロックの中身はスキップ不可

 with ham('ham2'):
     print(spam)  # => 'ham' すぐ上のwithが影響してる

Open Class
=======================================

* Ruby は **Open Class** という機能で **クラスの再定義** が可能です。
* Python は クラスをオープンすることはできません
* ただ、ここまで見たきたように、動的にクラスに属性を追加することはできます。
* しかし **組み込みの型** に属性を付加することはできません。

.. code-block:: ruby
 :linenos:

 # ruby --
 class String
   def hello
     'Hello! String is ' + self
   end
 end

 p 'Spam'.hello() # => "Hello! String is Spam"

.. code-block:: python
 :linenos:

 # python --
 def hello(self):
     return 'Hello! String is' + self

 str.hello = hello # => TypeError: can't set attributes of built-in/extension type 'str'

Open Class
=======================================

* 組み込み型もクラスなので継承は可能
* クラスを継承して、独自の属性を追加することはできます。

.. code-block:: python
 :linenos:

 class MyStr(str):

     def hello(self):
         return 'Hello! String is ' + self

 spam = MyStr('Spam')
 print(spam.hello()) # => "Hello! String is Spam"

Open Class どうしてもやりたい!!!
=========================================

.. image:: https://pbs.twimg.com/media/Crr78N1VIAAh0K5.jpg

* どうしても組み込み型そのものにパッチを当てたいという方には。。。

Open Class - forbiddenfruit
=======================================

* https://github.com/clarete/forbiddenfruit ... **禁断の果実**
* **名前からしてヤバイ**
* ``ctypes`` モジュールを使って、組み込み型にもパッチを当てることが可能
* ``ctypes`` モジュールにある Python C API の機能を利用して実現
* ですが **メタプログラミングの範疇** を逸脱してる気がします。。。

.. code-block:: python
 :linenos:

 from forbiddenfruit import curse

 def hello(self):
     return 'Hello! String is ' + self

 curse(str, 'hello', hello)
 print('Spam'.hello()) # => "Hello! String is Spam"

ast
=======================================

* **抽象構文木(Abstract Syntax Tree)** を扱う標準ライブラリ
* Pythonのソースコードを **抽象構文木** にして変換して、ソースコードを操作することが可能

.. code-block:: python
 :linenos:

 import ast

 source = """
 class Spam:

     def __init__(self, name):
         self.name = name

     def hello(self):
         print('Hello {}'.format(self.name))
 """

 tree = ast.parse(source)
 ast.dump(tree)

ast
=======================================

.. code-block:: python
 :linenos:

 Module(
  body=[
   ClassDef(name='Spam', bases=[], keywords=[], body=[
    FunctionDef(
     name='__init__',
     args=arguments( args = [ arg(arg='self', annotation=None), arg(arg='name', annotation=None) ], vararg=None,
       kwonlyargs=[], kw_defaults=[], kwarg=None, defaults=[]
     ),
     body=[Assign(targets=[Attribute(value=Name(id='self', ctx=Load()), attr='name', ctx=Store() ], value=Name(id='name', ctx=Load()))
     ],
     decorator_list=[],
     returns=None
    ),
    FunctionDef(
     name='hello',
     # ~ 省略 ~
    ],
    decorator_list=[]
   )
  ]
 )

ast
=======================================

* **抽象構文木(Abstract Syntax Tree)** を書き換えたい
* ``ast.NodeTransformer`` を利用してコードを書き換える事ができる
* `Python の ast モジュール入門 (NodeVisitor を使う) <http://qiita.com/t2y/items/c8877cf5d3d22cdcf2a8>`_
* `Green Tree Snakes - the missing Python AST docs <https://greentreesnakes.readthedocs.io/en/latest/index.html>`_

ast - NodeTransformer
=======================================

* ``print`` を ``pprint`` に変えたい

.. code-block:: python
 :linenos:

 # python --
 source = """
 data = [
   { 'name': 'Spam', 'value': 1, },
   { 'name': 'Ham', 'value': 2, },
   { 'name': 'Egg', 'value': 3, }
 ]

 print(data)
 """
 # printすると一行見づらい
 # [{'name': 'Spam', 'value': 1}, {'name': 'Ham', 'value': 2}, {'name': 'Egg', 'value': 3}]
 # print(data) => pprint(data) に変えたい

ast - NodeTransformer
=======================================

.. code-block:: python
 :linenos:

 # python --
 import ast
 from pprint import pprint

 class PPrintTransformer(ast.NodeTransformer):

    def visit_Name(self, node):
       if node.id == 'print':
           name = ast.Name(id='pprint', ctx=ast.Load())
           return ast.copy_location(name, node)
       return node

 tree = ast.parse(source)
 code = compile(PPrintTransformer().visit(tree), '<string>', 'exec')
 exec(code)
 # => print が pprintに変わった結果が表示される
 # [{'name': 'Spam', 'value': 1},
 # {'name': 'Ham', 'value': 2},
 # {'name': 'Egg', 'value': 3}]

Import Hook
=======================================

* インポート時に処理をフックさせてカスタマイズができる
* 特定のモジュールを読み込んだら、自動的にコードを生成/変更に利用できる
* `PEP 302 -- New Import Hooks <https://www.python.org/dev/peps/pep-0302/>`_

Import Hook
=======================================

* 先ほどの **ast** の例と組み合わせる
* 特定のモジュールを ``import`` したら、 ``print`` を ``pprint`` に置き換える

.. code-block:: python
 :linenos:

 # print_data.py --
 data = [
   { 'name': 'Spam', 'value': 1, },
   { 'name': 'Ham', 'value': 2, },
   { 'name': 'Egg', 'value': 3, }
 ]
 print(data) # pprintに変える

Import Hook
=======================================

.. code-block:: python
 :linenos:

 import sys

 class MyImportHook:

  def find_module(self, mod_name, path=None):
      # 1. print_data というモジュールだけ return self => self.load_moduleに続く
      if mod_name == 'print_data':
          return self

  def load_module(self, mod_name):
      src = mod_name.replace('.', '/') + '.py' # 2. 対象のソースファイルを読み込む
      with open(src) as fp:
          src_code = fp.read()
      src_code =  'from pprint import pprint\n' + src_code # 3. pprintをimportする一文を追加
      tree = ast.parse(src_code)   # 4. astでパースしてcompile
      new_code = compile(PPrintTransformer().visit(tree), '<string>', 'exec')
      new_mod = types.ModuleType(mod_name) # 5. 新しく「print_data」モジュールを作る
      exec(new_code, new_mod.__dict__) # 6. モジュールの名前空間に、書き換えたコードを当てはめる
      sys.modules[mod_name] = new_mod
      return new_mod


Import Hook
=======================================

* `sys.meta_path` に追加することで **Import Hook** が有効になる

.. code-block:: python
 :linenos:

 sys.meta_path.insert(0, MyImportHook())
 import print_data

 # pprintに書き換わった結果が表示
 # [{'name': 'Spam', 'value': 1},
 # {'name': 'Ham', 'value': 2},
 # {'name': 'Egg', 'value': 3}]

Macro
=======================================

 既定のコードを置き換えるルールやパターンを作ることで簡潔な表現やコードの再利用性をもたらす.

 -- `Python とマクロ、インポートフックと抽象構文木 <http://t2y.hatenablog.jp/entry/2015/03/11/025123>`_

* https://github.com/lihaoyi/macropy ... Python2 Only
* **Import Hook** と **ast** を駆使して、機能拡張を行っている
* 詳細は難しいので割愛

Macro
=======================================

* 他に参考になりそうな実装
* http://www.grantjenks.com/docs/pypatt-python-pattern-matching/
* https://github.com/Suor/patterns
* https://github.com/mariusae/match

まとめ
===============================

* Pythonのクラス周りのおさらい
* 様々なメタプログラミングのテクニックを広く浅く紹介しました
* またそれらのテクニックがライブラリやフレームワークの中身では普通に使われているという話
* これらは知っていれば、ライブラリの作ったり/覗いたりすることにも役に立つと思います
* ただし乱用は厳禁。むやみに使えばシステムが逆に複雑なったり混乱を招く原因もなります。
* 確信をもって使えると判断した時だけ使うようにしましょう。
* ご利用は計画的に:)

参考
===============================

* https://github.com/tell-k/pyconjp2016/blob/master/reference.rst
* Webページ や 書籍 の著者の皆さんありがとうございます。

Special Thanks
===============================

* 忙しい合間を縫ってレビューしてくれた
* @shimizukawaさん @aodagさん @mahata
* ありがとうございます m(_ _)m

必要かどうかは悩むものは必要ない
=======================================

* Pythonのコアコミッター Tim Peters のありがたいお言葉

  Metaclasses are deeper magic than 99% of users should ever worry about.
  If you wonder whether you need them, you don't (the people who actually
  need them know with certainty that they need them, and don't need an explanation about why).

  メタクラスは、ユーザーの99%の人が考える以上に奥が深い魔法です。 必要かどうかを悩むようなものは必要ないのです (本当にそれを必要としている人は、それが必要であることを確信しており、なぜ必要なのかなど説明の必要はありません)。

  -- Python Guru Tim Peters"

* https://www.ibm.com/developerworks/jp/linux/library/l-pymeta/
* http://d.hatena.ne.jp/nishiohirokazu/20090213/1234477277

ご静聴ありがとうとございました m(_ _)m
===========================================
