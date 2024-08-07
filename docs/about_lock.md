해당 유저의 포인트 충전 그렇게 많이 일어나지 않고 충돌이 적을 것 같아 해당 테스트로 진행하게 되었습니다.

먼저, 제가 조사한 자료를 설명하며 분석 결과를 진행하게 되었습니다.

## 1. 자료선정

### 1.1 경쟁 조건이란?

경쟁 조건은 둘 이상의 프로세스가 공유 자원에 동시 접근하려고 할 때 발생하기에 두 사용자가 동시에 같은 계정에 포인트를 충전하려고 한다면 경쟁 조건이 발생할 수 있습니다.

### 1.2 락 종류

`분산락`, `비관락`, `낙관락`을 비교하려 하였고, 먼저 개념을 알고나서 적용하기로 했습니다.

### 1.3 분석

낙관적락은 읽기는 허용하기에 비교적 충돌이 적은 기능으로 추려내는게 좋겠다고 생각하여 유저의 포인트 충전으로 비교를 진행했습니다.

## 2. 비관락

### 2.1 비관락이란?

`비관적 락`은 동시성 제어 메커니즘 중 하나로 데이터 충돌이 자주 발생할 것 이라는 `비관적` 가정하게 작동이 되게어, 동시 수정이 빈번한 곳에서 사용이 됩니다. `비관적 락` 방식은 데이터에 접근하기 전에 먼저 락을 획득하고, 작업이 완료 된 후에 락을 해제하는 방식입니다.

### 2.2 장점과 단점

#### (1) 장점

- 데이터 일관성을 강력하게 보장
- 충돌이 자주 발생하는 환경에서 효과적이며, 구현이 상대적으로 간단

#### 단점

- 동시성이 낮아져 전체적인 성능이 저하될 수 있고
  - 한 번에 하나의 트랜잭션만 특정 리소스에 접근할 수 있으므로 대기 시간 동안 다른 작업을 수행할 수 없어 전반적인 처리량이 감소
- 리소스 사용량이 높다
  - 서버 시스템은 어떤 트랜잭션이 어떤 리소스를 락 중인지를 지속적으로 추적해야하고 락을 기다리는 트랜잭션들의 큐를 유지하고 관리해야 합니다.

### 2.3 작동 원리

```bash
	 +-------------------+
     |   Shared Resource |
     |    (Database)     |
     +-------------------+
              ^
              |
     +--------+--------+
     |    Lock Manager |
     +--------+--------+
              ^
              |
     +--------+--------+     +--------+--------+     +--------+--------+
     | Transaction 1   |     | Transaction 2   |     | Transaction 3   |
     |  (Locked)       |     |  (Waiting)      |     |  (Waiting)      |
     +-----------------+     +-----------------+     +-----------------+
              |                      |                        |
              |                      |                        |
         +---------+            +---------+              +---------+
         | Process |            | Process |              | Process |
         |    A    |            |    B    |              |    C    |
         +---------+            +---------+              +---------+

  Timeline:
  ---------->
     |
     |  Process A acquires lock
     |    |
     |    |   Process B requests lock (blocked)
     |    |      |
     |    |      |   Process C requests lock (blocked)
     |    |      |      |
     |    |      |      |   Process A releases lock
     |    |      |      |      |
     |    |      |      |      |   Process B acquires lock
     V    V      V      V      V    V
```

타임 라인은 락의 획득과 해제 순서를 보여줍니다.

#### (1) 순서

- Process A가 락을 획득합니다.
- Process B와 C가 차례로 락을 요청하지만 블록됩니다.
- Process A가 락을 해제한 후 Process B가 락을 획득합니다.

### 2.4 비관적 락의 분석 결과

비관적 락을 적용하여 단일 유저의 포인트 충전을 100회 시도를 진행했습니다. 결과는 1909ms 가 나오게 되었습니다. 초당 52.38 t/s 를 처리하는 것으로 확인되었습니다.

## 2. 낙관적 락

### 2.1. 낙관적 락이란?

낙관적 락은 `낙관적인` 접근 방식이며, `비관적 락`은 누군가 데이터를 변경할 거야, 그러니 미리 잠그자라고 생각하며 적용하고, `낙관적 락`은 아무도 데이터를 건드리지 않을 것이지만 장치를 해두는 것으로 생각하는 것입니다. `비관적 락`이 데이터에 접근할 떄마다 문을 잠그고 들어가는 것처럼 행동한다면, 낙관적 란은 대신 나올 때, 아 내가 들어갔을 때와 같은지 확인하는 방법이다.

실제로 구현할 때는 낙관적란은 보통 버전 번호나 타임스탬프를 사용하여 데이터를 읽을 때 이 버전을 함께 기억해두고, 수정할 때 이 버전이 여전히 같은지를 확인하여 다른 트랜잭션이 건드렸는지를 판단하도록 한다. 따라서, 낙관적 락은 충돌이 적은 환경에서 빛을 발하며, 비관적 락처럼 계속 문을 잠그고 다닐 필요가 없으니 빠르고 효울적입니다. 하지만, 충돌이 자주 일어나게 된다면 오히려 비관적락이 더 나을 수 있다는 것입니다.

### 2.2 장단점

#### (1) 장점

- 높은 동시성
  - 여러 트랜잭션이 동시에 데이터를 읽고 수정할 수 있습니다.

#### (2) 단점

- 충돌 시 재시도 필요
  - 버전 충돌
    - 필요하다면 트랜잭션을 재시도해야 합니다.
  - 애플리케이션 복잡성 증가
    - 충돌 감지와 해결 로직을 구현해야 합니다.

## 2.3 작동 원리

```bash
    +-------------------+
    |   Shared Resource |
    |    (Database)     |
    +-------------------+
             ^
             |
    +--------+--------+
    | Version Manager |
    +--------+--------+
             ^
             |
    +--------+--------+
    |   Transactions  |
    +--------+--------+
             ^
             |
    +--------+--------+
    |   Application   |
    +--------+--------+

 Timeline:
 ----------->
    |
    | T1 reads (v1)
    |   |
    |   |  T2 reads (v1)
    |   |    |
    |   |    |   T1 updates (v1 -> v2)
    |   |    |      |
    |   |    |      |   T2 attempts update (fails, v1 != v2)
    |   |    |      |      |
    |   |    |      |      |   T2 re-reads (v2)
    |   |    |      |      |      |
    |   |    |      |      |      |   T2 updates (v2 -> v3)
    V   V    V      V      V      V    V
 T1: Transaction 1
 T2: Transaction 2
 v1, v2, v3: Versions
```

#### (1) 순서

- T1과 T2가 동시에 버전 1을 읽습니다.
- T1이 먼저 업데이트를 성공하여 버전이 V2로 변경이 됩니다.
- T2가 업데이트를 시도하지만, 버전 불일치로 실패합니다.
- T2는 최신 버전(V2)을 다시 읽고, 업데이트를 재시도하여 성공합니다.(V3)
  \

### 2.5 낙관적 란의 분석 결과

낙관적 락을 적용하여 단일 유저의 포인트 충전을 100회 시도를 진행했습니다. 모든 트랜잭션이 재시도할 수 있게 만들어서 진행하도록 했고, 결과는 3521ms 가 나오게 되었습니다. 초당 28.40 t/s 를 처리하는 것으로 확인되었습니다.

> [!NOTE]
> 낙관적 락은 단순히 충돌이 없는 환경에 유리하므로 같은 환경에서 동일한 조건으로 진행한다면 충돌을 유도한 환경에서는 낙관적 락이 비관적 락보다 느린 것으로 확인했고, 당연히 충돌이 없는 환경에서는 낙관적 락을 사용하는게 유리할 것으로 보여집니다.

## 3. 분산락

### 3.1 분산락이란?

`분산 락`이란, 간단히 말해 여러 서버나 프로세스에 걸쳐 있는 시스템에서 공유 리소스에 대한 접근을 동기화하는 메커니즘입니다. 핵심은 중앙 관리자로 `예를 들어` Redis나 Zookeeper같은 시스템이 이 역할을 진행합니다. 프로세스가 리소스를 사용하고 싶을 때, 이 중앙 관리자에게 저 지금 이거 써도 되는지 물어보며, 관리자가 사용을 해도 된다고 허락한다면 쓰고 나서, 관리자에게 다 썻다고 알려주며 진행합니다.

분산락은 Redis를 사용한다면 키를 설정해서 락을 표현하기도 하고, Zookeeper를 쓴다면 임시 노드를 만들어 락을 나타내기도 합니다.

### 분산락의 단점

### 3.3 작동 원리 (redlock)

```bash

+-------------------+
|  Shared Resource  |
|   (Distributed)   |
+-------------------+
         ^
         |
+--------+---------+
|   Redlock System  |
| (Distributed Lock)|
|  +-------------+  |
|  | Redis Inst 1|  |
|  +-------------+  |
|  +-------------+  |
|  | Redis Inst 2|  |
|  +-------------+  |
+---------+---------+
     ^         ^
     |         |
+----+----+ +--+-----+
|Server A | |Server B|
+-----+---+ +----+---+
|Redlock|   |Redlock|
|Client |   |Client |
+--+---+    +--+---+
   |           |
   v           v
+---------+ +---------+
| Client 1| | Client 2|
+---------+ +---------+

Process Flow:
1. Try to acquire lock on majority of Redis instances -->
2. Success if majority achieved, Failure otherwise <--
3. Perform operation if lock acquired
4. Release lock on all instances -->
```

그림에는 실제 구현은 그림과 다르게 단일 서버, 단일 클러스터로 진행했습니다.

### 3.4 분석 결과

분석 결과는 100회 포인트 충전은 1909ms을 나타내었고, 이는 초당 52.38회 충전 작업을 처리할 수 있음을 의미합니다. 비관적 락(2031ms)보다 약 6% 빠른 성능을 보여줍니다.

## 4. 마지막으로

`락` ? 그냥 모두 비관적 락을 사용해서 확실하게 가자 라는 생각으로 접근했었습니다. 분산락의 기능을 알게된 후에는 그냥 분산락으로 단순하게 항상 이용하자 편하게 이런 생각이였지만, 각각의 기능들이 나온 이유가 있듯이 여러 조건(충돌이 많이 일어나는 곳인가?, 단순하게 해도 문제가 없는데 오히려 오버 스팩으로 가는게 아닌가?) 이런 것들을 고려해야한다는 것을 알게된 한주가 되었습니다.
