"""
Когда рассчитывается ход, сначала происходит расчет для зомби, потом для жертв.
Для зомби происходит перебор игроков в порядке их добавления в игру.
Для каждого игрока берется одна из его 4 программных карт и примеряется на
текущую ситуацию вокруг него. Каждая карта поворачивается на 90 градусов
по часовой стрелке в поиске совместимости.
Как только хотя бы одна карта совпадет с текущей ситуацией,
она считается победившей и зомби продвигается на одну клетку
в направлении действия этой карты.
Подробнее см. В Программирование Зомби.
Если схемы закончились и не найдено подходящей, зомби тупо идет вперед.

После того, как зомби закончили ходы, происходит расчет ходов людей.
Алгоритм описан  в секции Алгоритм Людей.

Люди убегают по простому алгоритму:
В противоположную сторону от зомби.
Если зомби больше одного, то пытается пробежать между двумя,
находящимися на самом большом расстоянии друг от друга.
Препятствие (стена) влияет на угол побега.
Если свободных клеток для побега нет, пропускает ход.
Если зомбей вокруг нет (радиус обзора - 5 клеток).
Одна клетка равна размеру одного юнита.
Сквозь стены люди видеть не могут.
Перемещение происходит со скоростью 1 клетка на каждый ход,
кроме случаев апгрейда (см. Апгрейды).
"""
import os
from pymongo import MongoClient


init_map = """WWWWWWWWWW
W..H...2.W
W..T.W...W
W.1......W
WWWWWWWWWW"""


tactics = {
    '1': [
         """.TTTTT.
..TTT..
...T...
...Z...
.......
.......
......."""
    ],
    '2': [
        """.TTTTT.
..TTT..
...T...
...Z...
.......
.......
......."""
    ]
}

FREE_TILES = ('.', 'T')


class Zombie:
    def __init__(self, player, x, y, tactics):
        self.player = player
        self.x = x
        self.y = y
        self.tactics = tactics

    def move(self, state):
        return state


class Human:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def move(self, state, zombies):
        # move far away from zombies
        current_score = self.get_score(self.x, self.y, zombies)
        possible_moves = {(0, 0): current_score}
        for x, y in ((-1, 0), (1, 0), (0, 1), (0, -1)):
            if state[self.x + x][self.y + y] not in FREE_TILES:
                continue
            possible_moves[(x, y)] = \
                self.get_score(self.x + x, self.y + y, zombies)
        print('human possible moves: ', possible_moves)
        move_x, move_y = min(possible_moves.items(), key=lambda x: x[1])[0]
        print('human will do: ', move_x, move_y)
        state[self.x][self.y] = 'T'
        state[self.x + move_x][self.y + move_y] = 'H'
        self.x += move_x
        self.y += move_y
        return state

    def get_score(self, y, x, zombies):
        return sum([(z.x - x)**2 + (z.y - y)**2 for z in zombies])


class BattleSimulation:
    def __init__(self, init_map, tactics):
        self.zombies = {}
        self.humans = []
        self.tactics = tactics
        self.init_map = self._parse_map(init_map)

    def _parse_map(self, init_map):
        map = []
        for i, x in enumerate(init_map.split('\n')):
            map.append([])
            for j, y in enumerate(x):
                map[i].append(y)
                if y in ('1', '2', '3', '4'):
                    self.zombies[y] = Zombie(y, i, j, self.tactics[y])
                if y == 'H':
                    self.humans.append(Human(i, j))
        return map

    def calculate_next_state(self, current_state):
        current_state = self.zombie_moves(current_state)
        current_state = self.human_moves(current_state)
        return current_state

    def zombie_moves(self, current_state):
        for zombie in self.zombies.values():
            current_state = zombie.move(current_state)
        return current_state

    def human_moves(self, current_state):
        for human in self.humans:
            current_state = human.move(current_state, self.zombies.values())
        return current_state

    def calculate_states(self, turns):
        states = [self.init_map, ]
        current_state = self.init_map
        for _ in range(turns):
            current_state = self.calculate_next_state(current_state)
            states.append(current_state)
        states = ['\n'.join(''.join(i) for i in state) for state in states]
        return states

    def pretty_print(self, state):
        print(state, '\n')


if __name__ == '__main__':

    client = MongoClient(os.environ['MONGODB_CONNECTION'])
    db = client.zombolab
    for fight in db.fights.find():
        print(fight)
        for player in db.users.find({'_id': {"$in": fight.get('players')}}):
            print(player)
    
    bs = BattleSimulation(init_map, tactics)
    states = bs.calculate_states(turns=20)
    for state in states:
        bs.pretty_print(state)
