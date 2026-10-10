

# 函数式编程

## 一、匿名内部类

前置知识：**接口 + 多态**

 ```
 接口 变量 = new 实现类();
 ```

匿名内部类的前提：必须是类或接口

应用：在调用含有接口类型参数的方法时

```java
new  类名/接口名(){    
     //重写接口方法
}
```

### 1.1类

```java
//有抽象方法的类必须把他声明为抽象类
public abstract class Animal {
    //类中只有一个抽象方法，如果有多个类，就用传统的子类继承父类形式重写方法
    public abstract void eat();
}
```

```java
public class Dog extends Animal{
    @Override
    public void eat(){
        System.out.println("在吃肉");
    }
}
```

```java
public static void main(String[] args) {
    //传统方法：创建子类对象，调用子类的方法
    Dog d = new Dog();
    d.eat();

    //匿名内部类：创建子类对象，调用子类的方法，但是不创建子类对象
    //整体等效于，Animal父类的子类对象
    new Animal(){
        //重写抽象方法
        @Override
        public void eat(){
            System.out.println("在吃肉");
        }
    }.eat();//通过子类对象调用重写之后的eat方法1

    String name = "旺财";//通过匿名内部类访问局部变量，在JDK8之前必须加final关键字

    Animal a =new Animal(){//多态，编译看左边，运行看右边，父类引用指向子类对象
        //重写抽象方法
        @Override
        public void eat(){
            System.out.println(name+"在吃肉");
        }
    };
    a.eat();//通过子类对象调用重写之后的eat方法2
}
```

### 1.2接口

```java
public interface Inter {
    //接口只有一个抽象方法，如果有多个抽象方法，就用传统的给接口创建实现类的方式
    public abstract void method();
}
```

```java
public static void main(String[] args) {
    /*new Inter(){
        @Override
        public void method() {
            System.out.println("重写后的method方法");
        }
    }.method();*/

    //传统方法:传递一个接口的实现类对象
    //function();

    //匿名内部类(常用作方法参数传递)方法:传递一个接口的实现类对象
    function(
            new Inter() {//创建一个Inter接口的实现类对象,传递给function方法,调用method方法
                @Override
                public void method() {
                    System.out.println("重写后的method方法");
                }
            }
            );
}
public static void function(Inter i){//通过多态形式给Inter接口传递一个实现类对象 Inter i= new Inter({..});
    i.method();
}
```

## 二、函数对象

### 2.1行为参数化

判断逻辑-行为：student->student.sex.equals("男")作为参数给lambda对象

```java
public static void main(String[] args) {
    List<Student> students = List.of(
            new Student("张三", 18, "男"),
            new Student("杨四", 16, "女"),
            new Student("周五", 19, "女"),
            new Student("宋六", 20, "男")
    );
    System.out.println(filter1(students));
    System.out.println(filter2(students));
}
static List<Student> filter1(List<Student> students){
    List<Student> res = new ArrayList<>();
    for(Student student : students){
        if(student.age<18){
            res.add(student);
        }
    }
    return res;
}
static List<Student> filter2(List<Student> students){
    List<Student> res = new ArrayList<>();
    for(Student student : students){
        if(student.sex.equals("男")){
            res.add(student);
        }
    }
    return res;
}
```

```java
public static void main(String[] args) {
    List<Student> students = List.of(
            new Student("张三", 18, "男"),
            new Student("杨四", 16, "女"),
            new Student("周五", 19, "女"),
            new Student("宋六", 20, "男")
    );

    System.out.println( filter0(students, student->student.age<18));
    System.out.println( filter0(students, student->student.sex.equals("男")));
}

interface Lambda{
    boolean test(Student student);
}
// 过滤方法:根据lambda表达式,过滤出符合条件的学生
//使得函数复用性增加，将来判断逻辑改变时，我们只需要把它封装在一个函数对象里，从外界传递进来
static List<Student> filter0(List<Student> students,Lambda lambda){
    List<Student> res = new ArrayList<>();
    for(Student student : students){
        if(lambda.test(student)){
            res.add(student);
        }
    }
    return res;
}
```

### 2.2延迟执行

核心思想：**把函数本身保存起来，不立刻调用；等到需要的时候再执行**，这就是延迟执行。

```java
@FunctionalInterface
interface MyTask {
    void run();
}

public class LazyDemo {
    public static void main(String[] args) {
        // lambda 是函数对象，赋值时不执行
        MyTask task = () -> {
            System.out.println("延迟执行的任务");
        };

        System.out.println("还没执行任务");
        task.run(); // 才执行
    }
}
```

---

## 三、函数对象的表现形式

### 3.1 lambda表达式

​        Lambda表达式是JDK8中一个重要新特性。它使用一个简洁清晰的表达式来表达一个接口，同时也简化了对集合以及数组数据的遍历、过滤和提取等操作。

**前提**：必须**是一个接口**且**里面只有一个抽象方法**(函数式接口)

```java
public interface Function<T, R> {
        R apply(T t);
    }
   //函数式接口
```

**使用格式**：(数据类型 参数名1, 数据类型 参数名2, ...)->{方法体}

**()**：代表的是要执行接口中对应的那个抽象方法，如果方法中有参数，那么就需要传递参数

**->**：固定格式，作用是将小括号中的参数传递给后面大括号的方法体中

**{}**：代表的是实现接口中的那个抽象方法后的方法体

```java
//匿名内部类
public static void main(String[] args) {
    new Thread(new Runnable() {
        @Override
        public void run() {
            System.out.println("Hello World!");
        }
    }).start();
}
```

```java
//lambda表达式
public static void main(String[] args) {
    new Thread(()->{System.out.println("Hello World!");}).start();
}//保留参数列表和方法体
```

**alt+enter**：匿名内部类和lambda表达式的转换

例:

```java
//Animal1接口
public interface Animal1 {
    public abstract void eat();
}
```

```java
   public static void main(String[] args) {
        UseAnimal(() -> {
            System.out.println("吃东西");
        });//调用方法,传递一个Animal1接口的实现类对象 1.写一个实现类 2.匿名内部类 3. 改写匿名内部类为Lambda表达式
    }
    
    private static void UseAnimal(Animal1 a) {//Animal1 a通过参数类型得知使用的哪个接口
        a.eat();//通过这个知道要重写的是哪个抽象方法
    }
```

**省略规则**:

- 当根据上下文可以推断出参数类型时，可以省略参数类型
- 方法体只有一句代码时大括号、 return 和唯一一句代码的分号可以省略
- 方法只有一个参数时小括号可以省略  a->a;

---

### 3.2方法引用

把已经有的方法拿过来用，当作函数接口中抽象方法的方法体。

**前提：**

- 引用处必须是函数式接口
- 被引用的方法必须已经存在
- 被引用方法的形参和返回值必须和抽象方法保持一致
- 被引用方法的功能要满足当前需求

```java
//方法引用                 //lambda表达式
Math::max                (int a, int b) -> Math.max(a, b);              //类型；：静态方法

Student::getName         (Student stu) -> stu.getName();                //类型：：非静态方法

System.out::println      (Object obj) -> System.out.println(obj);       //对象：：非静态方法

Student::new             () -> new Student();                           //类型：：new
```

#### 3.2.1引用静态方法

类名：：静态方法

```java
public class MrTestCase01 {
    public static void main(String[] args) {
        Integer[] arr={1,2,3,4,5,6,7,8,9,10};
        //匿名内部类
        Arrays.sort(arr, new Comparator<Integer>() {
            @Override
            public int compare(Integer a, Integer b) {
                return a-b;
            }
        });

        //lambda表达式
        Arrays.sort(arr, (Integer a, Integer b)-> {
            return a-b;
        });
        
        //lambda表达式简写
        Arrays.sort(arr, (a,  b)-> a-b);
        
        //方法引用
        Arrays.sort(arr, MrTestCase01::sub);
    }
    

    public static int sub(int a, int b){
        return a-b;
    }
}
```

#### 3.2.2引用成员方法

**格式：**对象: :成员方法

1. **其他类：**其他类对象: :方法名

   ```java
   class Cat{
       public void say(){
           System.out.println("喵喵");
       }
   }
   public class MrTestCase02 {
       public static void main(String[] args) {
           //传统方式:创建Cat对象，调用say方法
           Cat cat = new Cat();
           cat.say();
           System.out.println("------------");
           //使用匿名内部类
           new Cat(){
               @Override
               public void say(){
                   System.out.println("喵喵喵");
               }
           }.say();
           System.out.println("------------");
           //使用lambda表达式
           new Thread(()->{
               System.out.println("Hello World!");
           }).start();
           System.out.println("------------");
           //使用方法引用
           // 创建其他类对象
           Cat cat1 = new Cat();
           // 其他类对象::方法名
           Runnable run = cat1::say;
           run.run();
       }
   }
   ```

2. **本类：**this: :方法名

   只能在**实例方法**中使用，不能在 static 方法里用 this

   ```java
   public class Dog {
       public void bark() {
           System.out.println("汪汪");
       }
   
       public void test() {
           // this::本类方法
           Runnable run = this::bark;
           run.run();
       }
   
       public static void main(String[] args) {
           new Dog().test();
       }
   }
   ```

3. **父类：**super: :方法名

   子类中，引用父类的实例方法

   ```java
   class Animal {
       public void hello() {
           System.out.println("动物打招呼");
       }
   }
   
   class Bird extends Animal {
       @Override
       public void hello() {
           System.out.println("小鸟打招呼");
       }
   
       public void test() {
           // super::父类方法，调用父类版本，不是子类重写的
           Runnable run = super::hello;
           run.run();
       }
   
       public static void main(String[] args) {
           new Bird().test();
       }
   }
   
   ```

#### 3.2.3引用构造方法

**格式：**类名: :new

**范例：**student: :new

```java
// 实体类
class Person {
    private String name;
    // 无参构造
    public Person() {
        System.out.println("Person 无参构造执行");
    }
    // 有参构造
    public Person(String name) {
        this.name = name;
        System.out.println("Person 有参构造：" + name);
    }
}

// 函数式接口，匹配无参构造
@FunctionalInterface
interface PersonCreator {
    Person create();
}

// 函数式接口，匹配有参构造
@FunctionalInterface
interface PersonNameCreator {
    Person create(String name);
}

public class Test {
    public static void main(String[] args) {
        // 无参构造引用：类名::new
        PersonCreator pc1 = Person::new;
        Person p1 = pc1.create();

        // 有参构造引用：类名::new
        PersonNameCreator pc2 = Person::new;
        Person p2 = pc2.create("张三");
    }
}
```

#### 3.2.4其他调用方法

1.类名引用成员方法

> **格式：**类名: :成员方法
>
> **范例：**String: :subString
>
> **局限性：**
>
> - 不能引用所有类中的成员方法。
> - 与抽象方法第一个参数有关，参数类型是什么那么就只能一怒用这个类中的方法。

2.数组 的构造方法

> **格式：**数据类型[ ] : :new
>
> **范例：**int[ ] : : new

比较：

| 编号 | 格式               | 特点               | 备注           |
| ---- | ------------------ | ------------------ | -------------- |
| 1    | 类名：：静态方法   | 参数一致           |                |
| 2    | 类名：：非静态方法 | 参数多一个该类对象 |                |
| 3    | 对象：：非静态方法 | 参数一致           |                |
| 4    | 类名::new          | 参数一致           |                |
| 5    | this:: 非静态方法  | -                  | 3 特例，很少用 |
| 6    | super:: 非静态方法 | -                  | 3 特例，很少用 |

---

## 五、函数对象的类型

参数个数类型相同+返回值类型相同->函数式接口

#### 常见函数接口： 

```java
1. Runnable
() -> void

2. Callable
() -> T

3. Comparator
(T, T) -> int

4. Consumer, BiConsumer, IntConsumer, LongConsumer, DoubleConsumer
(T) -> void , Bi是两参, Int指参数是 int

5. Function, BiFunction, Int Long Double ...
(T) -> R , Bi是两参, Int指参数是 int

6. Predicate, BiPredicate, Int Long Double ...
(T) -> boolean , Bi是两参, Int指参数是 int

7. Supplier, Int Long Double ...
() -> T , Int 指返回值是 int

8. UnaryOperator, BinaryOperator, Int Long Double ...
(T) -> T , Unary 一参, Binary 两参, Int 指参数是 int
```

#### 命名规则：

| 名称      | 含义                         |
| --------- | ---------------------------- |
| Consumer  | 有参，无返回值               |
| Function  | 有参，有返回值               |
| Predicate | 有参，返回 boolean           |
| Supplier  | 无参，有返回值               |
| Operator  | 有参，有返回值，并且类型一样 |

| 前缀       | 含义 |
| ---------- | ---- |
| Unary      | 一元 |
| Binary     | 二元 |
| Ternary    | 三元 |
| Quaternary | 四元 |

## 插播：Record(JDK17+)

### 1. 什么是 `record`

`record` 是 **Java 16+** 新增的**数据载体类**，专门用来保存纯数据，自动帮你生成一堆代码，不用手写。

> 作用：只用来存数据，属性**不可变**（自动 final）。

```java
record Student(String name, String sex) {}
```

- `record`：关键字，代表这是一个记录类
- `Student`：类名
- `(String name, String sex)`：**组件列表** 等价于自动生成：
  1. 两个私有 final 成员变量：`private final String name; private final String sex;`
  2. 构造方法 `Student(String name, String sex)`
  3. 访问方法：`name()` 和 `sex()`（不是 getName！直接`对象.name()`调用）
  4. 自动重写 `equals()`、`hashCode()`、`toString()`

record 里面**可以自己添加普通方法**

```java
record Student(String name, String sex) {
    public boolean isMale() {
        return "男".equals(this.sex);
    }
}
//判断这个学生性别是不是男，返回布尔值

public class Test {
    public static void main(String[] args) {
        Student s1 = new Student("张三", "男");
        System.out.println(s1.name());    // 张三
        System.out.println(s1.sex());     // 男
        System.out.println(s1.isMale());  // true
    }
}
```

## 七、闭包和柯里化

### 7.1 闭包

闭包 = Lambda + 捕获外部局部变量；

捕获的局部变量必须 final /effective final； 

目的：给 Lambda 提供外部数据。

```java
public class ClosureTest2 {

    // 闭包作用: 给函数对象提供参数以外的数据
    public static void main(String[] args) throws IOException {
        // 创建 10 个任务对象，并且每个任务对象给一个任务编号
        List<Runnable> list = new ArrayList<>();
        for (int i = 0; i < 10; i++) {
            int k = i + 1;
            Runnable task = ()-> System.out.println(Thread.currentThread()+":执行任务" + k);
            list.add(task);
        }

        ExecutorService service = Executors.newVirtualThreadPerTaskExecutor();
        for (Runnable task : list) {
            service.submit(task);
        }
        System.in.read();
    }
}
```

### 7.2 柯里化

把接收多个参数的函数，拆成一串只接收单个参数的函数，每次传一个参数，分步执行

## 八、高阶函数

高阶函数 = 能把函数当作参数传进去 / 能把函数当返回值返回 的函数

## 九、Stream  API

Stream流的特性：

一次使用，两类操作

forEach：`forEach(System.out::println)`

**filter-过滤**：`filter(f->f.category().equals("浆果")) `       关键：Predicate

**map-映射**:`map(f->f.cname()+"酱")`       关键：Function

**flatMap-降维**:`flatMap(list->list.stream())`    二维变一维   关键Function

**构建流**：用已有数据构建出Stream对象 

​              1.从集合构建：`集合.stream()`    

​              2.从数组构建：`Arrays.stream(数组)`    

​              3.从对象构建：`Stream.of(对象 ...)` 

**流的合并**：`Stream.concat(流1,流2)`

**流的截取**：

1根据位置 `流.offset(?).limit(?)`  `skip(long n)`跳过n个数据，保留剩下的 `limit(long n)`保留n个数据，剩下的不要

2.根据条件 `流.takeWhile(条件)` 条件成立保留，一旦条件不成立，剩下的不要

​                `流.dropWhile(条件)` 条件成立舍弃，一旦条件不成立，剩下的保留

**生成流**：不用现有数据生成Stream对象

1.简单生成：`IntStream.range(...)`

2.依赖 上一个值生成当前值：`IntStream.iterate(...)` 

例：生成奇数序列：

`IntStream.iterate(1,x->x+2).limit(10).forEach(System.out::println)`或

`IntStream.iterate(1,x->x<=9,x->x+2).forEach(System.out::println)`

3.不依赖上一个值生成当前值：`IntStream.generate(...)`

例：随机生成一百以内的五个数

`IntStream.generate(()->ThreadLocalRandom.current().nextInt(100)).limit(5).forEach(System.out::println)`或

`ThreadLocalRandom.current().ints(5,0,100).forEach(System.out::println)`

**查找**

1. `filter( Predicate p ).findAny()`  //在这些元素中随便找一个返回
2. `filter( Predicate p ).findFirst()` //在这些元素中挑出第一个返回

**判断**

1. `anyMatch( Predicate p )`
2. `allMatch( Predicate p )`
3. `noneMatch( Predicate p )`

---

- `filter(Predicate p)`：过滤，保留满足 p 条件的元素
- `findFirst()`：拿到**第一个**匹配的元素（有序流优先取最前面）
- `findAny()`：拿到**任意一个**匹配元素，并行流时效率更高，不一定是第一个
- `anyMatch`：**任意一个满足条件就返回 true**（有一个就行）
- `allMatch`：**全部都满足条件才返回 true**（全部达标）
- `noneMatch`：**没有任何一个满足条件才返回 true**（全都不满足）

> 参数 Predicate：断言函数式接口，输入元素，返回布尔值。

**去重**：`distinct()`

`IntStream.of(1,2,2,3,4,5,6,6,7).distinct().forEach(System.out::println)`

**排序**：`sorted((a,b)->int)`

```java
Stream.of(
            new Student("张三", 18, "男"),
            new Student("杨四", 16, "女"),
            new Student("周五", 19, "女"),
            new Student("宋六", 20, "男")
    )
    //.sorted((a, b) -> a.age() < b.age() ? -1 : a.age() == b.age() ? 0 : 1)
    //.sorted((a, b) -> Integer.compare(a.age(), b.age()))
    //.sorted(Comparator.comparingInt(h->h.age()))
    //.sorted(Comparator.comparingInt(Hero::age).reversed())//按年龄降序
    .sorted(Comparator.comparingInt(Hero::age).reversed().thenComparingInt(h-h.name().length())))//按年龄降序，年龄相等，按名字长度排序
    .forEach(System.out::println);
```

```java
record Hero(String name, int age, String sex){}
```

**reduce**：把流里面所有元素，不断两两合并，最后压缩成一个结果。

- `p`：previous，上一轮合并得到的结果
- `x`：当前正在遍历的元素
- `r`：本轮计算后，新的合并结果

三个重载方法:

1. `reduce((p,x)->r)` 无初始值 拿第一个元素当 p，从第二个元素开始遍历合并；流为空会返回`Optional`，防止空。
2. `reduce(init, (p,x)->r)` 带初始值 init 第一次 p=init，再依次和每个 x 合并；**永远不会空**。
3. `reduce(init, (p,x)->r, (r1,r2)->r)` 三参数（并行流专用） 第三个参数用来合并多个并行子任务算出的结果，串行流第三个参数不会执行。

```java
public class ReduceTest {
    record Hero(String name, int age, String sex) {...}

    public static void main(String[] args) {
        Optional<Hero> result = Stream.of(
            new Student("张三", 18, "男"),
            new Student("杨四", 16, "女"),
            new Student("周五", 19, "女"),
            new Student("宋六", 20, "男")
        ).reduce( (h1, h2) -> h1.age()>h2.age()?h1:h2);
        //找年龄最大的  = stream.max(Comparator.comparingInt(Hero::age))
        System.out.println(result);
    }
}
            
```

**收集**：将元素收集入容器，自己指定：**造一个空盒子，然后把流里每个元素挨个丢进盒子**。

`collect( 容器工厂, 累加器 )` 两个 lambda：

1. `() -> c` 【容器工厂】：**创建空容器 c**（比如 `new ArrayList`）
2. `(c, x) -> void`【累加器】：把当前流元素`x`放进容器`c`

> 完整重载是 3 个参数，并行流才需要第三个合并参数，这里简写了两个。

```java
Stream<String> stream = Stream.of("张三","李四","王五","赵六","陈七","李八");
//List<String> result = stream.collect(()->new ArrayList<>(),(list, x)->list.add(x),(a,b)->{});
List<String> result = stream.collect(ArrayList::new,ArrayList::add,(a,b)->{});
for(String s : result){
    System.out.println(s);
}
```

等价于：`stream.collect(Collectors.toList())`

**和 Collectors 的关系**

`Collectors.toList()` 底层，本质就是封装了这个 collect 的两个 lambda。

**对比** **reduce**

- reduce：不断合并值，最后得到**单个结果**
- collect：造容器，把所有元素**全部装进去**

还有收集到`set`，`Map`，`StringBuilder`(转化为字符串），`StringJoiner`(转换为字符串，中间逗号连接)

```java
Map<String, Integer> map = stream.collect(Collectors.toMap(x -> x, x -> 1));

/*
Map
3: new ArrayList(["令狐冲" "风清扬" "向问天" "任我行"])
4: new ArrayList(["独孤求败", "东方不败"])
2: new ArrayList(["方证", "冲虚" "不戒"])

下游收集器
*/

Map<Integer, List<String>> result = stream.collect(Collectors.groupingBy(x -> x.length(), Collectors.toList()));
```

**下游收集器**

1.**`Collectors.mapping()`**

`mapping(转换逻辑, 下游收集器)` 作用：**在收集之前，先把组里的每个元素做转换，再收集**

---

2.**`Collectors.filtering()`**

`filtering(判断条件, 下游收集器)` 作用：**先分组，然后在每一组内部做过滤，留下满足条件的元素，再收集**

1. `stream.filter()`：**分组之前全局过滤**，不满足的直接丢掉，不会生成对应的分组 key
2. `Collectors.filtering()`：**分组之后，组内过滤**。哪怕一组全部过滤空了，这个 key 依然保留，value 是空 List

---

3.**`Collectors.flatMapping() `**

`flatMapping(元素 -> 子流, 下游收集器)` 作用：**分组之后，组内把一个元素拆成多个元素（扁平化），再收集**

---

4.`**Collectors.counting()**`   

作用：**分组后，统计每组里面元素的个数，返回 Long 类型**

返回类型：`Map<名字长度, Long>`

---

5.`Collectors.minBy(比较器)`

作用：**分组之后，按比较规则找出组内最小的元素，返回`Optional<T>`**

---

6.Collectors.maxBy(比较器)

---

7.`Collectors.summingInt(ToIntFunction)`

- 作用：分组后，对每组元素提取 int 字段，**累加求和**
- 返回类型：`Integer`
- 配套：`summingLong`、`summingDouble`

---

8. `Collectors.averagingDouble(ToDoubleFunction)`

- 作用：分组后，提取数值，**计算每组平均值**
- 返回类型：`Double`；空分组返回`0.0`
- 配套：`averagingInt`、`averagingLong`

----

9.`Collectors.reducing()`

`reducing` 归约收集器，作为 `groupingBy` 的下游收集器，**组内把多个元素合并成一个结果**。 有 3 个重载版本：

1. `reducing(BinaryOperator<T> op)`
2. `reducing(T identity, BinaryOperator<T> op)`
3. `reducing(U identity, Function<? super T,? extends U> mapper, BinaryOperator<U> op)`

```java
package com.learn;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import static java.util.stream.Collectors.*;

record Hero(String name, int strength) { }
public class Test {
    public static void main(String[] args) {
        Stream<Hero> stream = Stream.of(new Hero("令狐冲", 90),
                new Hero("风清扬", 98),
                new Hero("独孤求败", 100),
                new Hero("方证", 92),
                new Hero("东方不败", 98),
                new Hero("冲虚", 90),
                new Hero("向问天", 88),
                new Hero("任我行", 92),
                new Hero("不戒", 88)
        );
        /*
         1. mapping(x->y, dc)   需求：根据名字长度分组，分组后组内只保留他们的武力值
         new Hero("令狐冲", 90)->90
         dc 下游收集器 down collector
         */
        Map<Integer, List<Integer>> collect = stream.collect(
                groupingBy(
                        h -> h.name().length(),       // 第一层：按英雄名字长度分组
                        mapping(
                                h -> h.strength(),        // 组内转换：Hero对象 → 取出武力值int
                                toList()                  // 转换完之后，放进List
                        )
                ));

        for (Map.Entry<Integer, List<Integer>> entry : collect.entrySet()) {
            System.out.println(entry);
        }

        
        /*
          2. filtering(x->boolean, dc)   需求：根据名字长度分组，分组后组内过滤掉武力小于90的
        */
        Map<Integer, List<Hero>> collect1 = stream.collect(
                groupingBy(h -> h.name().length(), filtering(h -> h.strength() >= 90, toList()))
        );
        for (Map.Entry<Integer, List<Hero>> e : collect1.entrySet()) {
            System.out.println(e);
        }
        
        
        /*
        3. flatMapping(x->substream, dc)   需求：根据名字长度分组，分组后组内保留人名，并且人名切分成单个字符
         */
        Map<Integer, List<String>> collect = stream.collect(groupingBy(h -> h.name().length(),
                flatMapping(h -> h.name().chars().mapToObj(Character::toString), toList())));

        for (Map.Entry<Integer, List<String>> e : collect.entrySet()) {
            System.out.println(e);
        }
        
        /*
        4. counting()   需求：统计每个名字长度的分组数量
         */
        Map<Integer, Long> collect1 = stream.collect(groupingBy(h -> h.name().length(), counting()));
        for (Map.Entry<Integer, Long> e : collect1.entrySet()) {
            System.out.println(e);
        }
        
        /*
        5. minBy((a,b)->int)   需求：根据名字长度分组，分组后求每组武功最低的人
         */
        Map<Integer, Optional<Hero>> collect =
                stream.collect(groupingBy(h -> h.name().length(),minBy(Comparator.comparingInt(Hero::strength))));

        for (Map.Entry<Integer, Optional<Hero>> e : collect.entrySet()) {
            System.out.println(e);
        }
        
        /*
        7. summingInt(x->int)    需求：根据名字长度分组，分组后求每组武力和
        8. averagingDouble(x->double) 需求：根据名字长度分组，分组后求每组武力平均值
         */

       // 7 summingInt 求和
        Map<Integer, Integer> sumMap = stream.collect(
                groupingBy(h -> h.name().length(), summingInt(Hero::strength))
        );

        // 8 averagingDouble 求平均值
        Map<Integer, Double> avgMap = stream.collect(
                groupingBy(h -> h.name().length(), averagingDouble(Hero::strength))
        );
        
        // 按名字长度分组，组内reduce，取strength最大Hero
        Map<Integer, Optional<Hero>> map = stream.collect(
                groupingBy(h -> h.name().length(),
                        reducing( BinaryOperator.maxBy(Comparator.comparingInt(Hero::strength)) )
                )
        );

    }


}
```

**基本流**：

`IntStream` `LongStream` `DoubleStream`

| 方法                             | 作用                                          | 返回值说明                                            |
| -------------------------------- | --------------------------------------------- | ----------------------------------------------------- |
| `intStream.mapToObj(int -> obj)` | 把 int 转为对象，转成`Stream<对象>`           | 对象流 Stream<T>                                      |
| `intStream.boxed()`              | 把 int 装箱成 Integer，转`Stream<Integer>`    | `Stream<Integer>`，等价于`mapToObj(Integer::valueOf)` |
| `intStream.sum()`                | 求和                                          | int，空流返回 0                                       |
| `intStream.min()`                | 最小值                                        | `OptionalInt`，空流无值                               |
| `intStream.max()`                | 最大值                                        | `OptionalInt`，空流无值                               |
| `intStream.average()`            | 平均值                                        | `OptionalDouble`                                      |
| `intStream.summaryStatistics()`  | 一次性拿到全套统计：count、sum、min、max、avg | `IntSummaryStatistics`                                |

```java
IntStream.of(1,2,3,4,5)
    .boxed() //转Stream<Integer>
    .forEach(System.out::println);

IntSummaryStatistics stat = IntStream.of(1,2,3,4,5).summaryStatistics();
System.out.println(stat.getCount());
System.out.println(stat.getSum());
System.out.println(stat.getMin());
System.out.println(stat.getMax());
System.out.println(stat.getAverage());
```

`IntStream` 是原始 int 流；`boxed` 装箱成 `Integer `流；`summaryStatistics` 一次性拿到全部统计信息。

---

Stream流转换类方法：

| 方法                                     | 作用                                                   | 要点                                                 |
| ---------------------------------------- | ------------------------------------------------------ | ---------------------------------------------------- |
| `stream.map(x -> y)`                     | **一对一映射**，一个元素转成另一个元素                 | 元素数量不变，类型可改变；返回`Stream<Y>`            |
| `stream.flatMap(x -> substream)`         | **一对多 + 扁平化**，每个元素生成子流，把子流拆开合并  | 元素数量可变；把`Stream<Stream<T>>`压平成`Stream<T>` |
| `stream.mapMulti((x, consumer) -> void)` | 多元素输出（Java16+），一个元素可以发射 0/1 / 多个结果 | 替代 flatMap，性能更好，用 consumer 接收输出         |
| `stream.mapToInt(x -> int)`              | 转原始 int 流                                          | 返回`IntStream`                                      |
| `stream.mapToLong(x -> long)`            | 转原始 long 流                                         | 返回`LongStream`                                     |
| `stream.mapToDouble(x -> double)`        | 转原始 double 流                                       | 返回`DoubleStream`                                   |

```java
// map 一对一
Stream.of("1","2","3").map(Integer::valueOf);

// flatMap 扁平化
Stream.of(List.of(1,2), List.of(3,4))
        .flatMap(list -> list.stream());

// mapToInt 转为原始流
Stream.of(1,2,3).mapToInt(x -> x);
```

# 常用API

`Math`  

代表数学，是一个工具类，里面提供的都是对数据进行操作的一些静态方法。

`ceil`向上取整 `floor`向下取整 `round`四舍五入`max` `min` `pow` `random`

`System`

代表系统程序所在的系统，也是一个工具类

`exit`终止当前运行的虚拟机 `currentTimeMillis`返回long类型的事件毫秒值，从1970.1.1 0点开始计时

`Runtime`

代表程序所在的运行环境，是一个单例类

 ```java
 // 1、public static Runtime getRuntime() 返回与当前Java应用程序关联的运行时对象。
 Runtime r = Runtime.getRuntime();
 
 // 2、public void exit(int status) 终止当前运行的虚拟机,该参数用作状态代码；按照惯例，非零状态代码表示异常终止。
 // r.exit(0);
 
 // 3、public int availableProcessors()：获取虚拟机能够使用的处理器数。
 System.out.println(r.availableProcessors());
 
 // 4、public long totalMemory() 返回Java虚拟机中的内存总量。
 System.out.println(r.totalMemory()/1024.0/1024.0 + "MB"); // 1024 = 1K    1024 * 1024 = 1M
 
 // 5、public long freeMemory() 返回Java虚拟机中的可用内存量
 System.out.println(r.freeMemory()/1024.0/1024.0 + "MB");
 
 // 6、public Process exec(String command) 启动某个程序，并返回代表该程序的对象。
 // r.exec("D:\\soft\\XMind\\XMind.exe");
 Process p = r.exec("QQ");//这里必须要配置环境变量
 Thread.sleep(5000); // 让程序在这里暂停5s后继续往下走！！
 p.destroy(); // 销毁！关闭程序！
 
 ```

## `BigDecimal`

用于解决浮点型运算时，出现结果失真的问题。

常用构造器

| 构造器                                               | 说明                          |
| ---------------------------------------------------- | ----------------------------- |
| `public BigDecimal(double val)` 注意：不推荐使用这个 | 将 double 转换为 `BigDecimal` |
| `public BigDecimal(String val)`                      | 把 String 转成 `BigDecimal`   |

✅ 推荐两种方式：

- `new BigDecimal("字符串数字")`
- `BigDecimal.valueOf(double)`（底层也是转字符串，适合 double 转 `BigDecimal`

方法

| 方法名                                                       | 说明                            |
| ------------------------------------------------------------ | ------------------------------- |
| `public static BigDecimal valueOf(double val)`               | 转换一个 double 成 `BigDecimal` |
| `public BigDecimal add(BigDecimal b)`                        | 加法                            |
| `public BigDecimal subtract(BigDecimal b)`                   | 减法                            |
| `public BigDecimal multiply(BigDecimal b)`                   | 乘法                            |
| `public BigDecimal divide(BigDecimal b)`                     | 除法                            |
| `public BigDecimal divide` (另一个 `BigDecimal` 对象，精确几位，舍入模式) | 除法、可以控制精确到小数几位    |
| `public double doubleValue()`                                | 将 `BigDecimal` 转换为 double   |

```java
BigDecimal num1 = new BigDecimal("0.1");
BigDecimal num2 = new BigDecimal("0.2");
BigDecimal res = num1.add(num2);
System.out.println(res);

// 除法，保留2位小数，四舍五入
BigDecimal div = num1.divide(num2,2,BigDecimal.ROUND_HALF_UP);

```

---

## 传统日期时间（java8之前）

1. Date（`java.util.Date`）

- 底层：存储**毫秒时间戳**，代表从 1970-01-01 00:00:00 UTC 到当前的毫秒数。
- 常用构造：
  - `new Date()`：获取当前系统时间
  - `new Date(long time)`：根据毫秒戳创建日期对象
- 常用方法：
  - `getTime()`：返回时间戳（long）
  - `setTime(long time)`：设置时间戳
- ❌ 缺点：
  1. 月份从**0 开始**（0 代表 1 月，容易踩坑）
  2. 可变性：对象可以被修改，线程不安全
  3. API 设计混乱，很多方法已过时

2. SimpleDateFormat（`java.text.SimpleDateFormat`）

- 作用：**Date ↔ String 互相转换**（日期格式化 / 解析）

- 常用模式：

  - `yyyy` 年、`MM`月、`dd`日、`HH`24 小时制、`mm`分钟、`ss`秒
  - 示例模板：`yyyy-MM-dd HH:mm:ss`

- 核心方法

  - `format(Date date)`：Date → 格式化字符串
  - `parse(String source)`：字符串 → Date 对象

- ⚠️**重点坑（面试高频）：`SimpleDateFormat` 线程不安全！**

  > 多线程共用同一个 `SimpleDateFormat `实例会报异常、时间错乱。 解决：每次新建对象 / 使用` ThreadLocal`。

3. Calendar（`java.util.Calendar`）

- 作用：**日期时间的加减、字段修改**，弥补 Date 不好做日期运算的缺陷，是抽象类
- 获取实例：`Calendar cal = Calendar.getInstance();`
- 常用方法：
  - `get(Calendar.YEAR)` 获取年
  - `get(Calendar.MONTH)` 获取月（**同样从 0 开始！0=1 月**）
  - `get(Calendar.DAY_OF_MONTH)` 获取当月日期
  - `add(字段, 数值)`：时间加减，`add(Calendar.DAY_OF_MONTH,3)` 加 3 天
  - `set()` 设置年月日时分秒
- ❌ 缺点：
  1. 依然可变，线程不安全
  2. 月份 0 开始，容易出错
  3. API 笨重

三者关系

1. Date：代表一个时间点（毫秒）
2. `SimpleDateFormat`：Date 和字符串之间转换工具
3. Calendar：对 Date 做日期运算（加减、获取年月日）

---

  

## JDK8开始新增的日期、时间

 

> 核心优势：**不可变对象，线程安全；月份从 1 开始，符合人类习惯；API 简洁好用**

01 代替 Calendar

- `LocalDate`：只包含**年、月、日**，无时分秒
- `LocalTime`：只包含**时、分、秒**，无年月日
- `LocalDateTime`：**年、月、日 + 时、分、秒**（最常用）
- `ZoneId`：时区对象
- `ZonedDateTime`：**带时区的完整时间**，处理跨时区场景

02 代替 Date

- `Instant`：时间戳 / 时间线，代表 UTC 时间点，底层存纳秒，对应旧 Date

03 代替` SimpleDateFormat`

- `DateTimeFormatter`：时间格式化、字符串解析 ✅ 重点：**线程安全！** 可以定义为静态常量复用，解决 `SimpleDateFormat` 线程不安全的坑

04 其他补充（时间间隔）

- `Period`：计算**年月日**间隔（只能用于` LocalDate`）
- `Duration`：计算**时分秒、纳秒**间隔（用于 Instant/`LocalDateTime`）

# `Arrays`类

常用方法

```java
import java.util.Arrays;
import java.util.function.IntToDoubleFunction;

public class ArraysDemo {
    public static void main(String[] args) {
        // 1、public static String toString(类型[] arr): 返回数组的内容
        int[] arr = {10, 20, 30, 40, 50, 60};
        System.out.println(Arrays.toString(arr));

        // 2、public static 类型[] copyOfRange(类型[] arr, 起始索引, 结束索引)：拷贝数组（指定范围，包前不包后）
        int[] arr2 = Arrays.copyOfRange(arr, 1, 4);
        System.out.println(Arrays.toString(arr2));

        // 3、public static 类型[] copyOf(类型[] arr, int newLength)：拷贝数组，可以指定新数组的长度。
        int[] arr3 = Arrays.copyOf(arr, 10);
        System.out.println(Arrays.toString(arr3));

        // 4、public static setAll(double[] array, IntToDoubleFunction generator)：把数组中的原数据改为新数据又存进去。
        double[] prices = {99.8, 128, 100};
        Arrays.setAll(prices, (int index) -> {
            // 示例：所有元素*0.8 打8折
            return prices[index] * 0.8;
        });
        System.out.println(Arrays.toString(prices));

        // 5、public static void sort(类型[] arr)：对数组进行排序(默认是升序排序)
        int[] arr4 = {5, 2, 9, 1, 5, 6};
        Arrays.sort(arr4);
        System.out.println(Arrays.toString(arr4));
    }
}

```



方式一：`Comparable` 接口（实体类实现接口，重写`compareTo`）

> 特点：**把比较规则写在实体类内部**，属于对象本身自带的比较能力

```java
import java.util.Arrays;

// 实体类实现Comparable接口
class Student implements Comparable<Student>{
    private String name;
    private int age;

    public Student(String name, int age) {
        this.name = name;
        this.age = age;
    }

    // 重写compareTo，定义比较规则：按年龄升序
    @Override
    public int compareTo(Student o) {
        // this.age - o.age 升序； o.age - this.age 降序
        return this.age - o.age;
    }

    @Override
    public String toString() {
        return "Student{name='" + name + "', age=" + age + "}";
    }
}

public class ComparableDemo {
    public static void main(String[] args) {
        Student[] students = {
                new Student("张三",20),
                new Student("李四",18),
                new Student("王五",22)
        };
        // 直接sort，自动调用compareTo
        Arrays.sort(students);
        System.out.println(Arrays.toString(students));
    }
}
```

方式二：`Comparator` 比较器（外部传入比较规则，不修改实体类）

> 特点：**比较规则写在外部**，同一个类可以定义多种排序规则，灵活切换

```java
import java.util.Arrays;
import java.util.Comparator;

public class ComparatorDemo {
    public static void main(String[] args) {
        Student[] students = {
                new Student("张三",20),
                new Student("李四",18),
                new Student("王五",22)
        };

        // 写法1：匿名内部类
        Arrays.sort(students, new Comparator<Student>() {
            @Override
            public int compare(Student o1, Student o2) {
                // 按年龄降序：o2.age - o1.age
                return o2.getAge() - o1.getAge();
            }
        });

        // 写法2：Lambda简化
        // Arrays.sort(students,(o1,o2)-> o2.getAge()-o1.getAge());

        System.out.println(Arrays.toString(students));
    }
}
```

核心区分

1. `Comparable`：**内部比较器**，实体类实现接口，只能写一套默认比较规则。
2. `Comparator`：**外部比较器**，不改动实体类，随时可以新建不同排序规则。
3. 返回值规则：
   - 负数：o1 排在 o2 前面
   - 正数：o2 排在 o1 前面
   - 0：两者相等

# 泛型

## 泛型接口

如果这个泛型接口是一个泛型类，那么要保证实现接口的泛型类泛型标识包含泛型接口的泛型标识

```java
public class Pair<T, E> implements Generator<T> {

    private T key;
    private E value;
}
```

泛型类：实例化对象的时候，指定泛型的具体类型

```java
// Pair是泛型类<T,E>，new实例化时确定T和E是什么类型
Pair<String,Integer> pair = new Pair<>();
// 实例化这一刻：T=String，E=Integer
```

泛型方法：调用方法的时候，指定泛型的具体类型

```java
// 泛型方法定义：<M> 写在方法返回值前面
public static <M> M getSomething(M data){
    return data;
}

// 调用方法时，确定M的类型
String str = getSomething("hello");
```

## 泛型方法

1. **泛型方法能使方法独立于类而产生变化**

> 就算这个类**不是泛型类**，方法自己也可以带泛型，方法的类型参数不受类的类型参数约束。

1. **如果 static 方法要使用泛型能力，就必须使其成为泛型方法**

> static 静态方法不属于对象，不能使用**类上定义的泛型参数**；静态方法想用泛型，必须在方法上自己声明`<T>`，做成泛型方法。

### 泛型方法 vs 普通成员方法

> 核心区分：
>
> 1. **普通成员方法**：类型由**类上的泛型**决定，依赖类对象。
>
> 2. **泛型方法**：方法自己单独声明`<T>`，**独立于类**，类是不是泛型类都能用。
>
>    

普通成员方法

```java
// 泛型类：类定义时声明<T>
public class Demo<T> {
    // ========== 普通成员方法（使用【类的泛型T】，不是泛型方法） ==========
    public void show(T data) {
        System.out.println("普通成员方法，使用类的泛型：" + data);
    }

    // ========== 泛型方法（方法自己声明<M>，独立于类的T） ==========
    public <M> void genericShow(M data) {
        System.out.println("泛型方法，方法自有泛型：" + data);
    }

    public static void main(String[] args) {
        // 实例化泛型类，指定类的T为String
        Demo<String> demo = new Demo<>();

        // 普通成员方法：只能传入String，因为类的T被固定为String
        demo.show("abc");
        // demo.show(123); // 编译报错！类的T是String，不能传Integer

        // 泛型方法：每次调用自动推断类型，不受类的T约束
        demo.genericShow("hello");
        demo.genericShow(666);
        demo.genericShow(3.14);
    }
}
```

静态方法

静态方法**不能直接使用类上的泛型 T**，静态想要泛型，必须写成**泛型方法**

```java
public class Demo<T> {
    // ❌ 错误！静态方法不能直接使用类定义的T
    /*
    public static void test(T data){

    }
    */

    // ✅ 静态泛型方法：自己声明<E>，独立于类
    public static <E> void staticGeneric(E data) {
        System.out.println("静态泛型方法：" + data);
    }

    public static void main(String[] args) {
        staticGeneric(999);
        staticGeneric("test");
    }
}
```

### 泛型 + 可变参数

语法：`<T> 返回值 方法名(T... args)` `T...` 代表泛型可变参数，可以传入 0 个、1 个或多个同类型参数。

```
public class TestGeneric {

    // 泛型可变参数方法
    public static <T> void printAll(T... args) {
        for (T item : args) {
            System.out.println(item);
        }
    }

    public static void main(String[] args) {
        printAll("A", "B", "C");
        printAll(10, 20, 30, 40);
        printAll(3.14, 2.5);
    }
}
```

重点

- 普通泛型类的非静态方法：用**类上面的泛型**
- static 静态方法：**不能用类的泛型**，只能自己定义成泛型方法
- 泛型可变参数 `T...` 本质就是 `T[]`，可以循环遍历

## 类型通配符

？代表任意类型，用Object接收

> 作用：**代表任意未知类型**，用来定义泛型变量、参数，**不能用来定义泛型类 / 泛型方法的类型参数**。

### 1. 无界通配符 `<?>`

表示任意类型。

> 注意：`List<?>` 不是 `List<Object>`！ `List<Object>` 只能存 Object；`List<?>` 可以引用任意类型的 List，**除了 null 以外不能 add 元素**（不知道里面是什么类型，不安全）。

```java
import java.util.ArrayList;
import java.util.List;

public class WildCardDemo {
    // 参数：任意类型的List
    public static void printList(List<?> list){
        for(Object obj : list){
            System.out.println(obj);
        }
        // list.add(100); // 编译报错！不能add，不知道内部类型
    }

    public static void main(String[] args) {
        List<String> strList = new ArrayList<>();
        strList.add("aaa");
        List<Integer> intList = new ArrayList<>();
        intList.add(123);

        printList(strList);
        printList(intList);
    }
}
```

### 2. 上界通配符 `<? extends 类>`

`?` 只能是**该类或它的子类**

- 可读，可以拿元素（读出来是父类）
- **不能写（不能 add，除了 null）**

```java
import java.util.ArrayList;
import java.util.List;

class Animal{}
class Dog extends Animal{}

public class UpperBoundDemo {
    public static void showAnimal(List<? extends Animal> list){
        Animal a = list.get(0); // ✅ 读取，一定是Animal子类
        // list.add(new Dog()); // ❌ 编译报错，不确定是哪个子类
    }

    public static void main(String[] args) {
        List<Dog> dogList = new ArrayList<>();
        dogList.add(new Dog());
        showAnimal(dogList);
    }
}
```

### 3. 下界通配符 `<? super 类>`

`?` 只能是**该类或它的父类**

- 可读，读出来只能当作 Object
- ✅ **可以 add 这个类及其子类对象**

```java
import java.util.ArrayList;
import java.util.List;

class Animal{}
class Dog extends Animal{}

public class LowerBoundDemo {
    public static void addDog(List<? super Dog> list){
        list.add(new Dog()); // ✅ 可以添加Dog或Dog子类
        Object obj = list.get(0); // 读取只能是Object
    }

    public static void main(String[] args) {
        List<Animal> animalList = new ArrayList<>();
        addDog(animalList);
    }
}
```

核心对比

1. `<?>` 无界：任意类型；**只能读，不能存**
2. `<? extends T>` 上界（T 及子类）：**只能读，不能存**
3. `<? super T>` 下界（T 及父类）：**可读，可以存 T / 子类**

> 口诀：**上界读，下界写**

## 类型擦除

① 运行时无法获取泛型参数类型

```java
List<String> list1 = new ArrayList<>();
List<Integer> list2 = new ArrayList<>();
// 运行时，list1.getClass() == list2.getClass()，都是ArrayList
System.out.println(list1.getClass() == list2.getClass()); // true
```

> 运行时分不清 `List<String>` 和 `List<Integer>`，擦除后都是 `ArrayList`。

## 泛型与数组

核心一句话：**可以声明泛型数组引用，不能直接 new 泛型数组对象；可以用反射`Array.newInstance`创建 T []**

> 根源：类型擦除，运行时不知道 T 的真实类型，`new T[]`无法拿到类型信息，编译报错。

1. 正误代码对比

```
public class GenericArray<T> {
    // ✅ 可以声明泛型数组引用
    T[] arr;

    // ❌ 编译报错！不能直接创建泛型数组对象
    // public GenericArray(){
    //     arr = new T[10];
    // }
}
```

- `T[] arr;` 只是**引用变量声明**，只是定义一个可以指向 T [] 数组的变量，没有创建数组实体，允许。
- `new T[10]` 是创建数组对象，运行时 T 被擦除，不知道是什么类型，Java 禁止。

# 注解

## 内置注解

Java 原生提供，直接写在代码上使用。

1. **@Override**

   - 作用：标记方法是**重写父类 / 接口的方法**
   - 编译器校验：如果方法签名和父类不一致，编译报错，防止写错方法名。

   ```java
   @Override
   public String toString() {
       return "test";
   }
   ```

2. **@Deprecated**

   - 作用：标记**已过时、不推荐使用**的类 / 方法 / 变量。
   - 编译警告：调用该元素时 IDE 会划删除线提示，但代码仍可运行。

   ```java
   @Deprecated
   public void oldMethod(){}
   ```

3. **@SuppressWarnings**

   - 作用：**抑制编译器警告**，消除黄色警告。
   - 参数：`unchecked`（泛型未检查）、`rawtypes`、`all`等。

   ```java
   @SuppressWarnings("unchecked")
   List list = new ArrayList();
   ```

## 元注解

**用来注解注解的注解**，只能加在注解定义 `@interface` 上面，标注在自定义注解上，控制注解的生命周期、作用目标等。

1. **@Target** 指定注解**能写在哪些位置**（作用目标） 可选值：ElementType

   - TYPE：类、接口、枚举
   - METHOD：方法
   - FIELD：成员变量
   - PARAMETER：方法参数

   ```java
   @Target(ElementType.METHOD)
   public @interface MyAnno{}
   ```

2. **@Retention** 指定注解**生命周期**（保留到哪个阶段）

   - `SOURCE`：源码阶段，编译后丢弃（如 @Override）
   - `CLASS`：编译保留在 class 文件，运行时 JVM 不加载（默认）
   - `RUNTIME`：运行时保留，可以通过**反射读取**（自定义注解常用）

   ```java
   @Retention(RetentionPolicy.RUNTIME)
   public @interface MyAnno{}
   ```

3. **@Documented** 作用：使用 javadoc 生成 API 文档时，**把这个注解也写入文档**。不加则注解不会出现在 doc 里。

4. **@Inherited** 作用：注解具备**继承性**。

   > 如果父类上加了这个注解，子类会自动继承该注解。 ⚠️ 只作用于类，方法、属性不生效。

## 自定义注解

自定义注解使用 `@interface` 关键字定义，搭配**元注解**来约束注解。

> 元注解：`@Target`、`@Retention`、`@Documented`、`@Inherited`

1. 定义注解

```java
import java.lang.annotation.*;

// 元注解：该注解只能写在方法上
@Target(ElementType.METHOD)
// 元注解：运行时保留，可以通过反射获取注解信息
@Retention(RetentionPolicy.RUNTIME)
// 元注解：生成javadoc文档时包含该注解
@Documented
// 元注解：子类可继承父类上的这个注解
@Inherited
public @interface MyLog {
    // 注解属性，格式：类型 名字() default 默认值;
    String value() default "";
    String desc() default "默认描述";
}
```

说明：

- `value`：特殊属性，使用注解时，如果只传 value，可以省略 `value=`
- 属性支持类型：基本类型、String、枚举、注解、以及它们的数组
- `default`：设置默认值，使用注解时可以不写这个属性

2. 使用注解

```java
public class UserService {

    // 使用自定义注解
    @MyLog(value = "查询用户", desc = "根据id查询用户信息")
    public void getUser(){
        System.out.println("执行查询用户");
    }

    // 只给value赋值，可以简写
    @MyLog("新增用户")
    public void addUser(){
        System.out.println("新增用户");
    }
}
```

3. 通过**反射解析注解**（核心，注解本身不会自动执行逻辑）

> 注解只是标记，必须用反射读取注解信息，写业务逻辑。

```java
import java.lang.reflect.Method;

public class AnnoTest {
    public static void main(String[] args) throws Exception {
        // 获取类对象
        Class<UserService> clazz = UserService.class;
        // 获取方法
        Method method = clazz.getDeclaredMethod("getUser");

        // 判断方法上是否有MyLog注解
        if(method.isAnnotationPresent(MyLog.class)){
            // 获取注解实例
            MyLog myLog = method.getAnnotation(MyLog.class);
            // 获取注解属性
            System.out.println(myLog.value());
            System.out.println(myLog.desc());
        }
    }
}
```

输出：

```
查询用户
根据id查询用户信息
```

### 总结

1. 自定义注解语法：`public @interface 注解名{}`
2. **@Retention 是重中之重**
   - `SOURCE`：源码有效，编译丢弃（如 @Override），反射拿不到
   - `CLASS`：class 文件保留，运行时 JVM 丢弃，默认策略，反射拿不到
   - `RUNTIME`：运行时保留，**反射可以读取**，自定义注解几乎都用这个
3. `@Target`：限定注解能标注的位置（类、方法、字段、参数等）
4. 注解**没有业务逻辑**，仅做标记；逻辑靠反射解析实现（AOP 底层大量使用自定义注解

# Java Class 类常用方法（`java.lang.Class`）

> Class 对象：代表一个类 / 接口的类型信息，**反射的入口**。 获取 Class 对象三种方式：
>
> 1. `类名.class`
> 2. `对象.getClass()`
> 3. `Class.forName("全类名")`

下面分方法 + 代码示例

```java
class User{
    private String name;
    public int age;

    public User(){}
    public User(String name){ this.name = name; }

    public void sayHello(){
        System.out.println("hello");
    }
    private void test(){}
}
```

1. **获取类名**

- `String getName()`：**全限定类名**（包名 + 类名）
- `String getSimpleName()`：简单类名（只有类名）

```java
Class<User> clazz = User.class;
System.out.println(clazz.getName());        // 包名.User
System.out.println(clazz.getSimpleName());  // User
```

2. **获取构造器 Constructor**

- `Constructor<?>[] getConstructors()`：获取**所有 public 构造方法**
- `Constructor<?>[] getDeclaredConstructors()`：获取**全部构造器（含 private）**
- `Constructor<T> getConstructor(参数类型.class)`：获取指定 public 构造器
- `Constructor<T> getDeclaredConstructor(参数类型.class)`：获取指定构造器，可私有

```java
// 获取无参public构造
Constructor<User> con = clazz.getConstructor();
User user = con.newInstance(); // 创建对象
```

3. **获取成员方法 Method**

- `Method[] getMethods()`：**所有 public 方法**（包含父类继承来的）
- `Method[] getDeclaredMethods()`：**本类中定义的全部方法，不含父类**（含 private）
- `Method getMethod("方法名", 参数类型.class)`：获取指定 public 方法
- `Method getDeclaredMethod("方法名", 参数类型.class)`：获取本类指定方法（可私有）

```java
Method method = clazz.getDeclaredMethod("sayHello");
method.invoke(user); // 执行方法
```

4. **获取成员变量 Field**

- `Field[] getFields()`：所有**public 成员变量**（含父类）
- `Field[] getDeclaredFields()`：本类全部字段（含 private，不含父类）
- `Field getField("字段名")`：获取指定 public 字段
- `Field getDeclaredField("字段名")`：获取本类指定字段（可私有）

```java
Field field = clazz.getDeclaredField("name");
field.setAccessible(true); // 暴力访问，取消private权限检查
field.set(user,"张三");
```

5. **注解相关（和刚才自定义注解配套）**

- `boolean isAnnotationPresent(注解.class)`：判断是否标注了该注解
- `<A extends Annotation> A getAnnotation(注解.class)`：获取注解对象

```java
if(clazz.isAnnotationPresent(MyLog.class)){
    MyLog anno = clazz.getAnnotation(MyLog.class);
}
```

6. **判断类型**

- `boolean isInterface()`：是否是接口
- `boolean isAnnotation()`：是否是注解类型
- `boolean isArray()`：是否是数组
- `boolean isPrimitive()`：是否是基本数据类型（int.class 是，Integer.class 不是）

7. **实例化对象（旧写法）**

- `T newInstance()`：调用**无参构造创建对象**（JDK9 废弃，推荐用 Constructor）

**重点区分**

1. `getXXX()`：只能拿**public**，包含父类
2. `getDeclaredXXX()`：拿**本类所有**（public/private/protected），**不含父类**
3. `setAccessible(true)`：不是修改权限，只是关闭 Java 访问检查，暴力反射

## JVM 类加载全过程

（5 个阶段：加载 → 链接 → 初始化，链接又分为验证、准备、解析）

> 类加载：JVM 把 class 字节码文件加载进内存，最终生成`Class`对象的整套流程

**加载阶段**

- `ClassLoader `读取`.class`字节码文件
- 字节码放入**方法区**，存储类的结构信息（类名、方法、字段、常量池）
- 在**堆**中创建`java.lang.Class`对象，作为访问方法区类信息的入口。

> 注意：Class 对象**在堆**；类的原始信息存**方法区**。

**链接阶段（验证、准备、解析）**

- 验证：校验字节码合法性、安全校验

- 准备：**static 类变量**在方法区分配内存，赋**默认初始值**

  ```java
  public static int a = 10; //准备阶段 a=0；10等到初始化阶段赋值
  ```

- 解析：常量池**符号引用 → 直接内存地址引用**

**初始化阶段** 执行`<clinit>()`类构造器，合并**static 变量赋值、静态代码块**，按代码顺序执行。 先父类、后子类，JVM 自动保证多线程同步。

### 内存区域简单区分

- **方法区**：存放类模板、static 变量、常量池（所有对象共享）
- **堆**：存放实例对象 + Class 对象
- **栈**：存放局部变量、方法调用栈帧（new 出来的对象引用在栈，对象本体在堆）

一句话串联整个流程

加载：读 class 字节码，生成 Class 对象； 链接：校验安全 → static 变量分配内存赋默认值 → 符号引用转地址； 初始化：执行静态代码与 static 赋值，先父后子，线程安全。

常考面试问题

1. 准备阶段 `static int a=10`，a 的值是多少？

> 0，准备阶段只赋默认值，10 在初始化阶段才赋值。

1. `<clinit>()`和`<init>()`区别？

> `<clinit>()`：类构造器，类加载初始化阶段执行，处理 static； `<init>()`：实例构造器，new 对象调用，处理成员变量、构造方法。

1. 什么时候触发类初始化？（主动引用）

- new 对象
- 调用静态方法 / 读取静态变量
- 反射调用
- 子类初始化，父类先初始化
- main 方法所在类启动

被动引用不会触发初始化（例如：子类引用父类 static 变量，不会初始化子类）

`ClassLoader` 类加载器（补充）

`ClassLoader `负责**加载阶段**，读取 class 字节码。 双亲委派模型：类加载收到加载请求，先交给父加载器；父加载器加载不了，自己才加载。 好处：防止核心类被篡改（比如`java.lang.String`），保证类全局唯一。

## 类初始化时机（主动引用 vs 被动引用，考试高频）

✅ 主动引用：**一定会触发类初始化（执行`<clinit>()`）**

1. JVM 启动，初始化`main()`方法所在的主类
2. `new` 创建该类实例对象
3. 访问类**静态成员（非 final 常量）**、调用静态方法
4. 使用反射（`Class.forName()`等）操作该类
5. 初始化子类时，如果父类还没初始化，**先初始化父类**

> 一句话：主动使用这个类，就触发初始化。

❌ 被动引用：**不会触发类初始化**

1. **子类引用父类静态变量**：只会初始化父类，子类不初始化

   ```java
   class Father{
       public static int num = 10;
   }
   class Son extends Father{}
   // 只初始化Father，Son不会初始化
   System.out.println(Son.num);
   ```

2. **创建该类型数组**：`Father[] arr = new Father[10];` 数组只是开辟数组内存，不会初始化`Father`类。

3. **访问 static final 常量**：编译期常量，在链接阶段就放入调用方常量池，直接使用，不触发原类初始化

   ```java
   class Test{
       public static final int A = 100;
   }
   // 不会初始化Test类！
   System.out.println(Test.A);
   ```

核心考点区分

- `static final` 编译期常量：被动引用，**不初始化类**
- `static`（不带 final）静态变量：主动引用，**触发类初始化**

# 反射

> 核心：**反射就是拿到 Class 对象，在运行时获取构造器、方法、成员变量，调用 / 修改；可以突破 private 访问限制** 前提：`c1` 是 `User.class` 的 Class 对象，`Class c1 = User.class;`

1. 反射获取带参构造器创建对象

```java
// 获取本类中参数为 String,int,int 的构造器（可以是private）
Constructor constructor = c1.getDeclaredConstructor(String.class, int.class, int.class);
// 通过构造器实例化User对象，传入实参
User user2 = (User)constructor.newInstance("秦疆", 001, 18);
```

- `getDeclaredConstructor(参数类型.class...)`：获取指定构造器，**包含私有构造器**
- `constructor.newInstance(实参)`：调用这个构造方法创建对象

2. 反射调用普通成员方法（Method）

```java
User user3 = (User)c1.newInstance(); // 调用无参构造生成对象
// 获取本类名为setName，参数是String类型的方法
Method setName = c1.getDeclaredMethod("setName", String.class);

// invoke：执行这个方法
// 第一个参数：哪个对象执行这个方法；后面是方法的参数
setName.invoke(user3, "狂神");
System.out.println(user3.getName());
```

✅ `Method.invoke(对象, 参数)`

- 如果是**实例方法**：第一个参数传对象实例（`user3`）
- 如果是**静态 static 方法**：第一个参数传 `null`

> 这里执行`user3.setName("狂神")`，最后 getName 输出：狂神

3. 反射操作成员变量 Field（重点：私有属性）

```java
User user4 = (User)c1.newInstance();
// 获取本类名为name的成员变量（可以是private）
Field name = c1.getDeclaredField("name");

// 关键！暴力反射
name.setAccessible(true); 
// 关闭Java的访问权限检查，允许读写private修饰的字段
name.set(user4,"狂神2"); // 给user4对象的name属性赋值
System.out.println(user4.getName());
```

- `getDeclaredField("name")`：拿到本类的 name 字段（private 也能拿到）
- **`setAccessible(true)`** 不是修改源码的 private 权限！只是**关闭访问检查**，允许反射访问私有成员（字段 / 方法 / 构造器都能用这个方法）
- `name.set(对象, 值)`：给指定对象的这个字段赋值

> 执行后 user4 的 name="狂神 2"，getName 输出狂神 2

高频考点总结

1. `getDeclaredXXX`：获取**本类所有**（public/private），不含父类；`getXXX`只能拿 public，含父类
2. `Method.invoke(obj, args)`：运行时调用方法
3. `Field.set(obj,value)`：运行时给成员变量赋值
4. `setAccessible(true)`：暴力反射，关闭权限校验，访问私有成员
5. 反射的缺点：**性能低、破坏封装**

易错点

- `c1.newInstance()` JDK9 之后废弃，推荐用 `Constructor.newInstance()` 创建对象
- 静态字段使用`field.set(null,值)`，第一个参数传 null，不需要对象实例

## 分析类初始化（主动引用 / 被动引用）

✅ 主动引用（触发类初始化，执行`<clinit>()`）

1. new 创建类实例
2. 调用类静态方法 / 读取静态变量（**排除 static final 编译期常量**）
3. 反射调用该类
4. 启动 main 方法，初始化 main 所在类
5. 子类初始化时，**父类必须先初始化**

❌ 被动引用（**不会触发类初始化**）

1. 子类引用父类静态变量：**只初始化父类，子类不初始化**

   ```
   System.out.println(Son.num); //num是父类static变量，Son不初始化
   ```

2. 创建该类数组：`User[] arr = new User[5];`，仅开辟数组内存，不加载初始化 User 类

3. 访问`static final`编译期常量：常量编译期就放入调用方常量池，不触发原类初始化

   ```
   public static final int A = 100;
   ```

> 核心一句话：**只有真正定义这个静态成员的类，才会被初始化**

> 小考点：`<clinit>()` 类构造器，处理静态；`<init>()`实例构造器，new 对象执行。

------

## 类加载器 `ClassLoader`

1. `ClassLoader `作用

负责**类加载阶段**：读取 class 字节码，转为 Class 对象。 **类加载器的核心：双亲委派模型**

2. 四层类加载器（JDK8）

1. **启动类加载器 `BootstrapClassLoader`**（C++ 写，无 Java 对象） 加载`JAVA_HOME/lib`下核心类库，如`java.lang.String`
2. **扩展类加载器 `ExtensionClassLoader`** 加载`JAVA_HOME/lib/ext`扩展包
3. **应用程序类加载器` AppClassLoader`（系统类加载器）** 加载我们自己写的项目 class、classpath 下的类，**默认加载器**
4. **自定义类加载器**：继承 `ClassLoader`，自定义加载逻辑

3. 双亲委派模型（重点）

> 加载请求**向上委托**，父加载器优先尝试加载；父加载器加载失败，本加载器才加载。 流程：

1. AppClassLoader 收到加载请求 → 交给父加载器 Extension
2. Extension 交给 Bootstrap
3. Bootstrap 能加载就加载；找不到，回退给 Extension；Extension 找不到，回退 AppClassLoader 加载

✅ 双亲委派好处

1. **安全**：防止核心类被篡改。比如自定义`java.lang.String`，会被 Bootstrap 加载，不会加载我们自己写的 String。
2. **类全局唯一**：同一个类，只会被同一个加载器加载一次，保证类唯一。

⚠️ 破坏双亲委派

典型例子：SPI 机制（JDBC），线程上下文类加载器。

考点简答

问：双亲委派模型流程？好处？

> 答：当类加载器收到加载请求，优先委托父加载器加载；父加载器无法加载，自身才加载。好处：安全，防止核心 API 被篡改；保证类在 JVM 中唯一性。

## 反射性能对比分析

核心结论

**反射比普通直接调用慢很多**，因为反射是运行时解析，需要做权限检查、类型校验、查找方法 / 字段，开销大。

三组对比

1. **普通调用（最快）** 直接`obj.setName()`，编译期就确定方法地址，无额外开销。
2. **反射调用（默认，慢）** `method.invoke(obj,xxx)`，运行时查找 + 权限校验。
3. **反射 + setAccessible (true)（提速，但依然慢于普通调用）** 关闭访问安全检测，减少一部分开销，**但不能消除类型查找开销**。

优化方案

1. `setAccessible(true)`：关闭权限检查，提升反射速度
2. 缓存`Method/Field/Constructor`对象，不要每次都重新`getDeclaredMethod`去查找
3. 高并发高频场景，尽量少用反射；框架底层才大量使用（Spring、MyBatis）

考点

反射优缺点 ✅优点：**动态**，运行时才能确定操作哪个类、哪个方法（框架核心基础） ❌缺点：**性能低；破坏封装；可读性差**

------

## 获取泛型信息

> Java 泛型：**编译期泛型擦除**，编译后字节码会把泛型去掉。 但是：**类 / 方法上定义的泛型参数，会保留在字节码的签名里，可以通过反射拿到**。

两个核心 API（`java.lang.reflect`包）

1. `ParameterizedType` 参数化类型（如`List<String>`、`Map<Integer,String>`）
2. `Type` 是所有类型的顶层接口，Class、ParameterizedType 都实现它

例子：获取方法返回值泛型

```
// 方法：public List<User> getUsers(){}
Method method = clazz.getDeclaredMethod("getUsers");
// 获取方法返回值的Type
Type returnType = method.getGenericReturnType();
if(returnType instanceof ParameterizedType){
    // 获取<>里面的泛型参数
    Type[] actualTypeArguments = ((ParameterizedType) returnType).getActualTypeArguments();
    for(Type type : actualTypeArguments){
        System.out.println(type); // class User
    }
}
```

区分

- `getReturnType()`：拿到原始类型 `List.class`，拿不到里面的 User
- `getGenericReturnType()`：拿到带泛型信息的完整类型`List<User>`

常见场景

MyBatis、Spring 框架，用反射读取接口 / 方法上的泛型，用来做类型映射。

> 一句话考点：泛型擦除只是**变量的泛型被擦除**；方法、类声明上的泛型签名保存在字节码，可以反射读取。

------

## 获取注解信息（⭐考试重点，和前面自定义注解配套）

> 前提：自定义注解上`@Retention(RetentionPolicy.RUNTIME)`，运行时保留，反射才能读取。 如果是 SOURCE/CLASS，运行时拿不到。

核心方法（Class、Method、Field 都有这一组）

1. `isAnnotationPresent(注解.class)`：判断**是否标注了该注解**，返回 boolean
2. `getAnnotation(注解.class)`：获取注解对象，拿到注解属性
3. `getAnnotations()`：获取所有注解（包含继承来的）
4. `getDeclaredAnnotations()`：获取本元素直接标注的注解，不包含继承

示例代码

```
// 假设User类上有注解 @Table("tb_user")
Class<User> clazz = User.class;
// 判断是否存在注解
if(clazz.isAnnotationPresent(Table.class)){
    Table tableAnno = clazz.getAnnotation(Table.class);
    String value = tableAnno.value(); //拿到注解里面的值 tb_user
}
```

> 对方法、字段获取注解同理：Method/Field 对象调用这几个方法。

应用场景（面试常问）

ORM 框架（MyBatis、Hibernate）：

- `@Table`：类上注解，映射数据库表名
- `@Column`：字段上注解，映射数据库列名 **原理：运行时用反射读取注解里面的配置信息**

考点

1. 注解`@Retention`取值：
   - `SOURCE`：源码阶段，编译丢弃，反射不可读
   - `CLASS`：class 字节码保留，类加载时丢弃，反射不可读
   - `RUNTIME`：运行时保留，**反射可以读取**（自定义注解要读注解信息，必须这个）
2. `@Inherited`：注解可继承，子类会继承父类上的这个注解

汇总简答

14. 反射性能：反射运行时解析，比普通调用慢；`setAccessible` (true) 可优化性能；优点动态，缺点性能差、破坏封装。 
15. 泛型获取：编译期泛型擦除；方法 / 类声明的泛型签名保存在字节码，用`getGenericReturnType`拿到 `ParameterizedType`，读取 <> 内的类型。
16. 注解获取：注解必须`@Retention(RUNTIME)`，反射才能读取；`isAnnotationPresent`判断，`getAnnotation`取出注解对象，读取属性，ORM 框架大量使用。
